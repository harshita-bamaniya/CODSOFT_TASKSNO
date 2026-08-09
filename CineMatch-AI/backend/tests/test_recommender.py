import sys
import os
import pytest

# Add the app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.recommender.engine import MovieRecommender

@pytest.fixture(scope="module")
def recommender():
    rec = MovieRecommender()
    return rec

def test_load_data(recommender):
    assert recommender.df is not None
    assert len(recommender.df) > 0
    assert "soup" in recommender.df.columns

def test_search_movies(recommender):
    results = recommender.search_movies("Interstellar")
    assert len(results) > 0
    assert results[0]["title"] == "Interstellar"

def test_get_movie_by_id(recommender):
    # Interstellar's TMDB ID is 157336
    movie = recommender.get_movie_by_id(157336)
    assert movie is not None
    assert movie["title"] == "Interstellar"

def test_trending(recommender):
    trending = recommender.get_trending(top_n=5)
    assert len(trending) == 5
    assert all("title" in m for m in trending)

def test_recommend_similar(recommender):
    # Recommend similar to Interstellar (ID: 157336)
    recs = recommender.recommend(movie_id=157336, top_n=5)
    assert len(recs) == 5
    # The output movies should not contain Interstellar itself
    assert all(m["id"] != 157336 for m in recs)
    # The output should have match scores
    assert all("match_score" in m for m in recs)
    assert all("explanation" in m for m in recs)

def test_recommend_personalized(recommender):
    # Recommend based on preferences (favorite genre: Science Fiction)
    prefs = {"favoriteGenres": ["Science Fiction"], "minimumRating": 7.0, "preferredReleasePeriod": "2010s_later"}
    recs = recommender.recommend(user_preferences=prefs, top_n=5)
    assert len(recs) > 0
    # Checks that vote average is above or equal to 7.0 (as specified in filter)
    assert all(m["vote_average"] >= 7.0 for m in recs)
