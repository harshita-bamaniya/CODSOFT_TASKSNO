import os
import sys
from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# Add the app directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.recommender.engine import MovieRecommender

app = FastAPI(title="CineMatch AI API", version="1.0.0")

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production specify actual origins, for local portfolio * is fine
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize recommender engine
recommender = MovieRecommender()

# Pydantic models for request validation
class UserPreferences(BaseModel):
    favoriteGenres: List[str] = Field(default_factory=list)
    minimumRating: float = Field(default=0.0, ge=0.0, le=10.0)
    preferredReleasePeriod: str = Field(default="Any")

class RecommendationRequest(BaseModel):
    movie_id: Optional[int] = None
    user_preferences: Optional[UserPreferences] = None
    user_ratings: Optional[Dict[str, float]] = None # movie_id -> rating mapping
    top_n: int = Field(default=12, ge=1, le=50)
    weights: Optional[Dict[str, float]] = None

# Success response helper
def api_success(data: Any, message: Optional[str] = None):
    return {
        "success": True,
        "data": data,
        "message": message
    }

# Error response helper
def api_error(message: str, status_code: int = 400):
    raise HTTPException(status_code=status_code, detail=message)

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.detail
        }
    )

@app.get("/api/health")
def health():
    return api_success({"status": "healthy", "dataset_loaded": recommender.df is not None})

@app.get("/api/movies")
def get_movies(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    genre: Optional[str] = None
):
    if recommender.df is None:
        return api_error("Dataset not loaded", 500)
    
    df_filtered = recommender.df.copy()
    if genre:
        genre_clean = genre.lower().strip()
        df_filtered = df_filtered[df_filtered['genres_display'].apply(
            lambda genres: any(g.lower() == genre_clean for g in genres)
        )]
        
    # Paginate
    start = (page - 1) * limit
    end = start + limit
    
    total = len(df_filtered)
    movies = df_filtered.iloc[start:end].to_dict(orient="records")
    
    return api_success({
        "movies": movies,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit,
        "total": total
    })

@app.get("/api/movies/search")
def search_movies(q: str = Query(..., min_length=1)):
    if recommender.df is None:
        return api_error("Dataset not loaded", 500)
    
    results = recommender.search_movies(q)
    return api_success(results)

@app.get("/api/trending")
def get_trending_movies(limit: int = Query(default=20, ge=1, le=50)):
    if recommender.df is None:
        return api_error("Dataset not loaded", 500)
    
    results = recommender.get_trending(top_n=limit)
    return api_success(results)

@app.get("/api/movies/{movie_id}")
def get_movie_detail(movie_id: int):
    movie = recommender.get_movie_by_id(movie_id)
    if not movie:
        return api_error("Movie not found", 404)
    return api_success(movie)

@app.get("/api/movies/{movie_id}/recommendations")
def get_movie_recommendations(movie_id: int, limit: int = Query(default=12, ge=1, le=50)):
    movie = recommender.get_movie_by_id(movie_id)
    if not movie:
        return api_error("Movie not found", 404)
        
    results = recommender.recommend(movie_id=movie_id, top_n=limit)
    return api_success(results)

@app.post("/api/recommendations")
def get_personalized_recommendations(req: RecommendationRequest):
    if recommender.df is None:
        return api_error("Dataset not loaded", 500)
        
    # Convert UserPreferences Pydantic model to dict
    prefs_dict = None
    if req.user_preferences:
        prefs_dict = req.user_preferences.model_dump()
        
    # Parse ratings dict keys to float values
    ratings_dict = None
    if req.user_ratings:
        ratings_dict = {str(k): float(v) for k, v in req.user_ratings.items()}
        
    results = recommender.recommend(
        movie_id=req.movie_id,
        user_preferences=prefs_dict,
        user_ratings=ratings_dict,
        top_n=req.top_n,
        weights=req.weights
    )
    return api_success(results)
