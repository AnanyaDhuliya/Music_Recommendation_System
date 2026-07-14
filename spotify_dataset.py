
"""
spotify_dataset.py
──────────────────
Fetches song data + audio features from the Spotify API and saves to songs.csv.
Run this once to build / refresh your dataset.

Requirements:
    pip install spotipy pandas

Setup:
    1. Go to https://developer.spotify.com/dashboard and create an app.
    2. Copy your Client ID and Client Secret into the variables below.
"""

import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd

# ─── Credentials (replace with your own) ─────────────────────────────────────
CLIENT_ID     = "d77c5d2403ea438caf7a6e75c048c88f"       # ← paste your Spotify Client ID
CLIENT_SECRET = "d477e9cd3fb84d2db75501ea09e6f775"   # ← paste your Spotify Client Secret


# ─── Authenticate ────────────────────────────────────────────────────────────

sp = spotipy.Spotify(
    auth_manager=SpotifyClientCredentials(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
    )
)


# ─── Search queries ───────────────────────────────────────────────────────────
# Add or change these to build the dataset you want

QUERIES = [
    "bollywood",
    "hindi pop",
    "arijit singh",
    "lata mangeshkar",
    "kishore kumar",
    "shreya ghoshal",
    "ar rahman",
    "sonu nigam",
]

LIMIT_PER_QUERY = 50   # max 50 per Spotify search call


# ─── Fetch tracks + audio features ───────────────────────────────────────────

songs   = []
seen_ids = set()   # avoid duplicates across queries

for query in QUERIES:
    print(f"Searching: '{query}' ...")
    results = sp.search(q=query, type="track", limit=LIMIT_PER_QUERY)

    for track in results['tracks']['items']:
        track_id = track['id']

        if track_id in seen_ids:
            continue
        seen_ids.add(track_id)

        # Audio features can be None for some tracks
        features = sp.audio_features(track_id)[0]
        if not features:
            continue

        songs.append({
            "title":        track['name'],
            "artist":       track['artists'][0]['name'],
            "id":           track_id,
            "genre_id":     1,                          # Spotify doesn't expose per-track genre;
            "mood_id":      1,                          # assign manually or derive from playlist
            "tempo":        features['tempo'],
            "energy":       features['energy'],
            "danceability": features['danceability'],
            "valence":      features['valence'],        # 0 = sad, 1 = happy
            "acousticness": features['acousticness'],
        })

print(f"\nFetched {len(songs)} unique tracks.")


# ─── Save to CSV ─────────────────────────────────────────────────────────────

df = (
    pd.DataFrame(songs)
    .drop_duplicates(subset=["title", "artist"])
    .reset_index(drop=True)
)

df.to_csv("songs.csv", index=False)
print(f"Saved {len(df)} songs to songs.csv ✓")