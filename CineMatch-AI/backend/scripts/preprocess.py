import os
import json
import pandas as pd
import numpy as np
import requests

def download_file(url, dest):
    print(f"Downloading {url} to {dest}...")
    response = requests.get(url, stream=True)
    response.raise_for_status()
    with open(dest, 'wb') as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    print("Download complete.")

def safe_parse_json(val):
    if pd.isna(val) or not val:
        return []
    try:
        return json.loads(val)
    except Exception:
        return []

def get_director(crew_str):
    crew = safe_parse_json(crew_str)
    for member in crew:
        if member.get('job') == 'Director':
            return member.get('name', '').strip().replace(" ", "").lower()
    return ""

def get_list(col_str):
    items = safe_parse_json(col_str)
    return [item.get('name', '').strip().replace(" ", "").lower() for item in items if 'name' in item]

def preprocess():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_dir = os.path.join(base_dir, 'data')
    artifacts_dir = os.path.join(base_dir, 'artifacts')
    
    os.makedirs(data_dir, exist_ok=True)
    os.makedirs(artifacts_dir, exist_ok=True)
    
    movies_path = os.path.join(data_dir, 'tmdb_5000_movies.csv')
    credits_path = os.path.join(data_dir, 'tmdb_5000_credits.csv')
    
    # Download dataset if not present
    movies_urls = [
        "https://raw.githubusercontent.com/vamshi121/TMDB-5000-Movie-Dataset/master/tmdb_5000_movies.csv",
        "https://raw.githubusercontent.com/harshitcodes/tmdb_movie_data_analysis/master/tmdb-5000-movie-dataset/tmdb_5000_movies.csv",
        "https://raw.githubusercontent.com/rashida048/Some-NLP-Projects/master/Movie%20Recommendation/tmdb_5000_movies.csv"
    ]
    credits_urls = [
        "https://raw.githubusercontent.com/harshitcodes/tmdb_movie_data_analysis/master/tmdb-5000-movie-dataset/tmdb_5000_credits.csv",
        "https://raw.githubusercontent.com/rashida048/Some-NLP-Projects/master/Movie%20Recommendation/tmdb_5000_credits.csv",
        "https://raw.githubusercontent.com/vamshi121/TMDB-5000-Movie-Dataset/master/tmdb_5000_credits.csv"
    ]
    
    if not os.path.exists(movies_path):
        success = False
        for url in movies_urls:
            try:
                download_file(url, movies_path)
                success = True
                break
            except Exception as e:
                print(f"Failed to download movies from {url}: {e}")
        if not success:
            raise Exception("Failed to download movies dataset from all candidate URLs.")
            
    if not os.path.exists(credits_path):
        success = False
        for url in credits_urls:
            try:
                download_file(url, credits_path)
                success = True
                break
            except Exception as e:
                print(f"Failed to download credits from {url}: {e}")
        if not success:
            raise Exception("Failed to download credits dataset from all candidate URLs.")
        
    print("Loading datasets...")
    movies_df = pd.read_csv(movies_path)
    credits_df = pd.read_csv(credits_path)
    
    print("Merging datasets...")
    # Merge on id/movie_id
    # credits_df columns: movie_id, title, cast, crew
    # movies_df columns: budget, genres, homepage, id, ...
    credits_df = credits_df.rename(columns={'movie_id': 'id'})
    df = pd.merge(movies_df, credits_df[['id', 'cast', 'crew']], on='id')
    
    print("Parsing metadata fields...")
    # Extract clean list features
    df['genres_list'] = df['genres'].apply(get_list)
    df['keywords_list'] = df['keywords'].apply(get_list)
    
    # Extract top 3 cast members
    def get_top_cast(cast_str):
        cast = safe_parse_json(cast_str)
        return [member.get('name', '').strip().replace(" ", "").lower() for member in cast[:3] if 'name' in member]
        
    df['cast_list'] = df['cast'].apply(get_top_cast)
    df['director'] = df['crew'].apply(get_director)
    
    # Fill missing overviews
    df['overview'] = df['overview'].fillna('')
    
    # Display names for UI (before removing spaces and lowercasing)
    def get_display_names(col_str, limit=None):
        items = safe_parse_json(col_str)
        names = [item.get('name', '').strip() for item in items if 'name' in item]
        if limit:
            return names[:limit]
        return names
        
    df['genres_display'] = df['genres'].apply(lambda x: get_display_names(x))
    df['keywords_display'] = df['keywords'].apply(lambda x: get_display_names(x, 6))
    df['cast_display'] = df['cast'].apply(lambda x: get_display_names(x, 4))
    
    def get_display_director(crew_str):
        crew = safe_parse_json(crew_str)
        for member in crew:
            if member.get('job') == 'Director':
                return member.get('name', '').strip()
        return ""
    df['director_display'] = df['crew'].apply(get_display_director)
    
    # Combine features into a single soup string
    def create_soup(row):
        overview = row['overview']
        genres = " ".join(row['genres_list'])
        keywords = " ".join(row['keywords_list'])
        cast = " ".join(row['cast_list'])
        director = row['director']
        # Give director weight by duplicating their name
        director_weighted = f"{director} {director}" if director else ""
        return f"{overview} {genres} {keywords} {cast} {director_weighted}".lower().strip()
        
    df['soup'] = df.apply(create_soup, axis=1)
    
    # Select final columns to save storage and memory
    final_cols = [
        'id', 'title', 'overview', 'popularity', 'vote_average', 'vote_count',
        'release_date', 'genres_display', 'keywords_display', 'cast_display',
        'director_display', 'genres_list', 'keywords_list', 'cast_list',
        'director', 'soup'
    ]
    cleaned_df = df[final_cols]
    
    # Clean up genres_display, keywords_display, etc. to be saved as JSON string
    for col in ['genres_display', 'keywords_display', 'cast_display', 'genres_list', 'keywords_list', 'cast_list']:
        cleaned_df[col] = cleaned_df[col].apply(json.dumps)
        
    cleaned_path = os.path.join(artifacts_dir, 'movies_cleaned.csv')
    cleaned_df.to_csv(cleaned_path, index=False)
    print(f"Preprocessing completed. Processed file saved to {cleaned_path}")

if __name__ == '__main__':
    preprocess()
