import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add the app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["status"] == "healthy"

def test_get_movies():
    response = client.get("/api/movies?page=1&limit=5")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert "movies" in json_data["data"]
    assert len(json_data["data"]["movies"]) <= 5
    assert json_data["data"]["total"] > 0

def test_search_movies():
    response = client.get("/api/movies/search?q=Interstellar")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) > 0
    assert json_data["data"][0]["title"] == "Interstellar"

def test_get_trending():
    response = client.get("/api/trending?limit=5")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) == 5

def test_get_movie_details():
    # Interstellar TMDB ID: 157336
    response = client.get("/api/movies/157336")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert json_data["data"]["title"] == "Interstellar"

def test_get_movie_details_not_found():
    response = client.get("/api/movies/9999999")
    # Our exception handler catches HTTPException and returns a success=False JSON
    assert response.status_code == 404
    json_data = response.json()
    assert json_data["success"] is False
    assert "not found" in json_data["message"].lower()

def test_get_movie_recommendations():
    response = client.get("/api/movies/157336/recommendations?limit=5")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) == 5
    assert all("match_score" in m for m in json_data["data"])

def test_post_recommendations():
    payload = {
        "movie_id": 157336,
        "user_preferences": {
            "favoriteGenres": ["Science Fiction"],
            "minimumRating": 7.0,
            "preferredReleasePeriod": "2010s_later"
        },
        "user_ratings": {
            "157336": 5.0
        },
        "top_n": 5
    }
    response = client.post("/api/recommendations", json=payload)
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["success"] is True
    assert len(json_data["data"]) <= 5
