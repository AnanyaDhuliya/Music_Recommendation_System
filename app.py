

from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler
import urllib.request
import urllib.parse
import json
import re

app = Flask(__name__)

# ─── Genre & Mood maps ────────────────────────────────────────────────────────
GENRE_MAP = {1:"Romantic",2:"Sad",3:"Party / Dance",4:"Devotional",5:"Peppy / Upbeat",6:"Sufi / Folk"}
MOOD_MAP  = {1:"Calm",2:"Happy",3:"Intense",4:"Melancholic",5:"Romantic",6:"Energetic"}

# ─── Load & preprocess ────────────────────────────────────────────────────────
songs = pd.read_csv("songs.csv")
songs["genre_name"] = songs["genre_id"].map(GENRE_MAP)
songs["mood_name"]  = songs["mood_id"].map(MOOD_MAP)

FEATURE_COLS = ['genre_id', 'tempo', 'mood_id']
scaler = MinMaxScaler()
feature_matrix = scaler.fit_transform(songs[FEATURE_COLS])
similarity_matrix = cosine_similarity(feature_matrix)

# ─── iTunes cache ─────────────────────────────────────────────────────────────
itunes_cache = {}

def normalize(s):
    """Lowercase, remove punctuation and extra spaces for comparison."""
    s = s.lower().strip()
    s = re.sub(r"[^\w\s]", "", s)   # remove punctuation
    s = re.sub(r"\s+", " ", s)      # collapse spaces
    return s

def words_overlap(a, b):
    """Check if majority of words in `a` appear in `b`."""
    wa = set(normalize(a).split())
    wb = set(normalize(b).split())
    if not wa:
        return False
    overlap = len(wa & wb) / len(wa)
    return overlap >= 0.5   # at least 50% of title words match

def fetch_itunes(title, artist):
    """
    Fetch artwork + preview from iTunes Search API.
    Strictly validates the result matches the requested song
    to avoid returning wrong artwork/preview for Bollywood songs
    that aren't in iTunes or match a different track.
    """
    cache_key = f"{title}||{artist}".lower()
    if cache_key in itunes_cache:
        return itunes_cache[cache_key]

    empty = {"artwork": "", "preview": "", "itunes": ""}

    try:
        # Strategy 1: search title + artist together
        query = urllib.parse.quote(f"{title} {artist}")
        url   = f"https://itunes.apple.com/search?term={query}&media=music&limit=5&country=in"
        req   = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read())

        result = empty
        if data["resultCount"] > 0:
            for track in data["results"]:
                itunes_title  = track.get("trackName", "")
                itunes_artist = track.get("artistName", "")

                title_match  = words_overlap(title,  itunes_title)
                artist_match = words_overlap(artist, itunes_artist)

                # Accept only if BOTH title and artist match reasonably well
                if title_match and artist_match:
                    result = {
                        "artwork": track.get("artworkUrl100","").replace("100x100","400x400"),
                        "preview": track.get("previewUrl",""),
                        "itunes":  track.get("trackViewUrl",""),
                    }
                    break

        # Strategy 2: if no match yet, try title-only search with stricter title check
        if not result["artwork"]:
            query2 = urllib.parse.quote(title)
            url2   = f"https://itunes.apple.com/search?term={query2}&media=music&limit=5&country=in"
            req2   = urllib.request.Request(url2, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req2, timeout=5) as resp2:
                data2 = json.loads(resp2.read())

            if data2["resultCount"] > 0:
                for track in data2["results"]:
                    itunes_title = track.get("trackName","")
                    # Very strict: title must match closely
                    if normalize(title) == normalize(itunes_title) or words_overlap(title, itunes_title):
                        result = {
                            "artwork": track.get("artworkUrl100","").replace("100x100","400x400"),
                            "preview": track.get("previewUrl",""),
                            "itunes":  track.get("trackViewUrl",""),
                        }
                        break

    except Exception:
        result = empty

    itunes_cache[cache_key] = result
    return result


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/songs")
def list_songs():
    genre_filter = request.args.get("genre","").strip()
    mood_filter  = request.args.get("mood","").strip()
    filtered = songs.copy()
    if genre_filter:
        filtered = filtered[filtered["genre_name"].str.lower() == genre_filter.lower()]
    if mood_filter:
        filtered = filtered[filtered["mood_name"].str.lower() == mood_filter.lower()]
    return jsonify(filtered[["title","artist","genre_name","mood_name","tempo"]].to_dict(orient="records"))

@app.route("/genres")
def list_genres():
    counts = songs["genre_name"].value_counts().reset_index()
    counts.columns = ["genre","count"]
    return jsonify(counts.to_dict(orient="records"))

@app.route("/moods")
def list_moods():
    counts = songs["mood_name"].value_counts().reset_index()
    counts.columns = ["mood","count"]
    return jsonify(counts.to_dict(orient="records"))

@app.route("/itunes")
def itunes_lookup():
    """Proxy endpoint — browser calls this, we call iTunes, validate, return."""
    title  = request.args.get("title","").strip()
    artist = request.args.get("artist","").strip()
    if not title:
        return jsonify({"artwork":"","preview":"","itunes":""})
    return jsonify(fetch_itunes(title, artist))

@app.route("/recommend")
def recommend():
    song_name = request.args.get("song","").strip().lower()
    if not song_name:
        return jsonify({"error":"No song name provided.","recommendations":[]}), 400

    matches = songs[songs["title"].str.lower() == song_name]
    if matches.empty:
        return jsonify({"error":f'"{song_name}" not found. Try browsing the song list.',"recommendations":[]}), 404

    idx = matches.index[0]
    row = songs.iloc[idx]
    seed_itunes = fetch_itunes(row["title"], row["artist"])

    scores = sorted(enumerate(similarity_matrix[idx]), key=lambda x: x[1], reverse=True)
    recommendations = []
    for i, score in scores:
        if i == idx:
            continue
        r = songs.iloc[i]
        rec_itunes = fetch_itunes(r["title"], r["artist"])
        recommendations.append({
            "title":   r["title"],
            "artist":  r["artist"],
            "genre":   r["genre_name"],
            "mood":    r["mood_name"],
            "tempo":   int(r["tempo"]),
            "score":   round(float(score), 3),
            "artwork": rec_itunes["artwork"],
            "preview": rec_itunes["preview"],
            "itunes":  rec_itunes["itunes"],
        })
        if len(recommendations) == 5:
            break

    return jsonify({
        "seed": {
            "title":   row["title"],
            "artist":  row["artist"],
            "genre":   row["genre_name"],
            "mood":    row["mood_name"],
            "tempo":   int(row["tempo"]),
            "artwork": seed_itunes["artwork"],
            "preview": seed_itunes["preview"],
            "itunes":  seed_itunes["itunes"],
        },
        "recommendations": recommendations
    })

@app.route("/stats")
def stats():
    return jsonify({
        "total_songs":   len(songs),
        "total_artists": songs["artist"].nunique(),
        "total_genres":  songs["genre_name"].nunique(),
        "avg_tempo":     round(float(songs["tempo"].mean()), 1)
    })

if __name__ == "__main__":
    app.run(debug=True)