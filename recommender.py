"""
recommender.py
──────────────
Standalone recommendation engine.
Can be imported by app.py or run directly for quick testing.
"""

import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler


# ─── Load & preprocess ───────────────────────────────────────────────────────

songs = pd.read_csv("songs.csv")

FEATURE_COLS = ['genre_id', 'tempo', 'mood_id']

scaler = MinMaxScaler()
feature_matrix = scaler.fit_transform(songs[FEATURE_COLS])

# Build similarity matrix once — O(n²) work done at import time, not per call
similarity_matrix = cosine_similarity(feature_matrix)


# ─── Public API ──────────────────────────────────────────────────────────────

def get_recommendations(song_name: str, n: int = 5) -> list[dict]:
    """
    Return up to `n` song recommendations for the given song name.

    Parameters
    ----------
    song_name : str
        Title of the seed song (case-insensitive).
    n : int
        Maximum number of recommendations to return (default 5).

    Returns
    -------
    list of dict  –  each dict has keys: title, artist, score
    Returns an empty list if the song is not found.
    """
    song_name = song_name.strip().lower()
    matches = songs[songs['title'].str.lower() == song_name]

    if matches.empty:
        return []

    idx = matches.index[0]

    scores = sorted(enumerate(similarity_matrix[idx]), key=lambda x: x[1], reverse=True)

    results = []
    for i, score in scores:
        if i == idx:
            continue                          # skip the seed song itself
        row = songs.iloc[i]
        results.append({
            "title":  row['title'],
            "artist": row['artist'],
            "score":  round(float(score), 3)
        })
        if len(results) == n:
            break

    return results


def get_all_songs() -> list[dict]:
    """Return every song in the dataset as a list of {title, artist} dicts."""
    return songs[['title', 'artist']].to_dict(orient='records')


# ─── Quick test ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("All songs in dataset:")
    for s in get_all_songs():
        print(f"  • {s['title']} — {s['artist']}")

    print()
    test_song = songs['title'].iloc[0]
    print(f"Recommendations for '{test_song}':")
    recs = get_recommendations(test_song)
    if recs:
        for rec in recs:
            print(f"  {rec['title']} by {rec['artist']}  (match: {rec['score'] * 100:.1f}%)")
    else:
        print("  No recommendations found.")