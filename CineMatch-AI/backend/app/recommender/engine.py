import os
import json
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class MovieRecommender:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.cleaned_path = os.path.join(self.base_dir, 'artifacts', 'movies_cleaned.csv')
        self.df = None
        self.tfidf_matrix = None
        self.cosine_sim = None
        self.id_to_idx = {}
        self.idx_to_id = {}
        self.load_data()

    def load_data(self):
        if not os.path.exists(self.cleaned_path):
            print(f"Cleaned dataset not found at {self.cleaned_path}. Run preprocessing first.")
            return False

        print("Loading processed movie metadata...")
        self.df = pd.read_csv(self.cleaned_path)
        
        # Deserialize JSON columns
        json_cols = ['genres_display', 'keywords_display', 'cast_display', 'genres_list', 'keywords_list', 'cast_list']
        for col in json_cols:
            self.df[col] = self.df[col].apply(lambda x: json.loads(x) if isinstance(x, str) else [])
            
        self.df['director_display'] = self.df['director_display'].fillna('')
        self.df['director'] = self.df['director'].fillna('')
        self.df['soup'] = self.df['soup'].fillna('')
        
        # Create id mappings
        for idx, row in self.df.iterrows():
            m_id = int(row['id'])
            self.id_to_idx[m_id] = idx
            self.idx_to_id[idx] = m_id
            
        print("Computing TF-IDF vectorizer and cosine similarity...")
        vectorizer = TfidfVectorizer(stop_words='english')
        self.tfidf_matrix = vectorizer.fit_transform(self.df['soup'])
        self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)
        print("Recommender engine initialized successfully.")
        return True

    def get_movie_by_id(self, movie_id):
        m_id = int(movie_id)
        if m_id not in self.id_to_idx:
            return None
        idx = self.id_to_idx[m_id]
        row = self.df.iloc[idx]
        return row.to_dict()

    def search_movies(self, query, top_n=20):
        if not query:
            return []
        query_clean = str(query).lower().strip()
        # Direct substring matching on title
        results = self.df[self.df['title'].str.lower().str.contains(query_clean, na=False)]
        
        # Sort by popularity to return best matches first
        results = results.sort_values(by='popularity', ascending=False)
        return results.head(top_n).to_dict(orient='records')

    def get_trending(self, top_n=20):
        # Sort by combination of vote average and popularity
        # Normalize popularity first
        pop_max = self.df['popularity'].max() if self.df['popularity'].max() > 0 else 1
        self.df['norm_pop'] = self.df['popularity'] / pop_max
        self.df['score_trending'] = 0.5 * (self.df['vote_average'] / 10.0) + 0.5 * self.df['norm_pop']
        
        # Filter out movies with low vote count to ensure quality
        qualified = self.df[self.df['vote_count'] >= 50]
        if len(qualified) < top_n:
            qualified = self.df
            
        results = qualified.sort_values(by='score_trending', ascending=False).head(top_n)
        return results.to_dict(orient='records')

    def recommend(self, movie_id=None, user_preferences=None, user_ratings=None, top_n=12, weights=None):
        """
        Generates hybrid recommendations.
        w_content: similarity to query movie or user's favorite movies (60% default)
        w_pref: overlap with user's favorite genres / ratings (20% default)
        w_pop: overall movie score based on TMDB rating and popularity (20% default)
        """
        if self.df is None:
            return []

        # Set default weights
        if weights is None:
            weights = {"content": 0.6, "preference": 0.2, "rating": 0.2}
            
        w_content = weights.get("content", 0.6)
        w_pref = weights.get("preference", 0.2)
        w_pop = weights.get("rating", 0.2)

        # 1. Content Similarity Vector
        sim_scores = np.zeros(len(self.df))
        query_movie_title = None

        if movie_id is not None:
            m_id = int(movie_id)
            if m_id in self.id_to_idx:
                query_idx = self.id_to_idx[m_id]
                sim_scores = self.cosine_sim[query_idx].copy()
                query_movie_title = self.df.iloc[query_idx]['title']
        elif user_ratings and len(user_ratings) > 0:
            # Weighted average similarity based on positive user ratings (rating >= 3)
            weighted_sims = []
            total_weight = 0
            for r_id, rating in user_ratings.items():
                r_id = int(r_id)
                if r_id in self.id_to_idx and rating >= 3:
                    idx = self.id_to_idx[r_id]
                    # weight: rating 5 -> 2.5, rating 4 -> 1.5, rating 3 -> 0.5
                    weight = rating - 2.5
                    weighted_sims.append(self.cosine_sim[idx] * weight)
                    total_weight += weight
            if total_weight > 0:
                sim_scores = sum(weighted_sims) / total_weight

        # 2. Preference Match Vector
        pref_scores = np.zeros(len(self.df))
        favorite_genres = []
        min_rating = 0.0
        pref_years = []

        if user_preferences:
            favorite_genres = [g.lower() for g in user_preferences.get('favoriteGenres', [])]
            min_rating = float(user_preferences.get('minimumRating', 0.0))
            
            # Simple release period mapping
            pref_period = user_preferences.get('preferredReleasePeriod', 'Any')
            if pref_period == '2010s_later':
                pref_years = list(range(2010, 2030))
            elif pref_period == '2000s':
                pref_years = list(range(2000, 2010))
            elif pref_period == '1990s':
                pref_years = list(range(1990, 2000))
            elif pref_period == '1980s_older':
                pref_years = list(range(1800, 1990))

        # Precompute preference scores
        if favorite_genres or pref_years:
            for idx, row in self.df.iterrows():
                score = 0.0
                if favorite_genres:
                    movie_genres = [g.lower() for g in row['genres_display']]
                    overlap = len(set(movie_genres).intersection(set(favorite_genres)))
                    if overlap > 0:
                        score += (overlap / max(1, len(favorite_genres))) * 0.7
                
                if pref_years and not pd.isna(row['release_date']):
                    try:
                        year = int(row['release_date'].split('-')[0])
                        if year in pref_years:
                            score += 0.3
                    except Exception:
                        pass
                pref_scores[idx] = score

        # 3. Popularity / Rating Signal Vector
        pop_max = self.df['popularity'].max() if self.df['popularity'].max() > 0 else 1
        norm_pop = self.df['popularity'] / pop_max
        norm_vote = self.df['vote_average'] / 10.0
        pop_scores = (0.7 * norm_vote + 0.3 * norm_pop).values

        # 4. Combine Scores
        hybrid_scores = (w_content * sim_scores) + (w_pref * pref_scores) + (w_pop * pop_scores)

        # 5. Filter and Rank
        exclude_ids = set()
        if movie_id is not None:
            exclude_ids.add(int(movie_id))
        if user_ratings:
            for r_id in user_ratings.keys():
                exclude_ids.add(int(r_id))

        results = []
        # Sort indices by hybrid score
        sorted_indices = np.argsort(hybrid_scores)[::-1]
        
        for idx in sorted_indices:
            m_id = self.idx_to_id[idx]
            if m_id in exclude_ids:
                continue
                
            row = self.df.iloc[idx]
            
            # Apply hard threshold filters if specified
            if min_rating > 0 and row['vote_average'] < min_rating:
                continue

            # Calculate match percentage (normalize hybrid_score to [0, 1])
            # Content similarity runs [0, 1], pref [0, 1], pop [0, 1]
            match_percentage = int(min(100, max(30, hybrid_scores[idx] * 100)))

            # Generate structured explanation
            explanation = self.generate_explanation(
                row, 
                query_movie_title, 
                favorite_genres, 
                sim_scores[idx]
            )

            movie_data = row.to_dict()
            movie_data['match_score'] = match_percentage
            movie_data['explanation'] = explanation
            results.append(movie_data)
            
            if len(results) >= top_n:
                break

        return results

    def generate_explanation(self, movie_row, query_movie_title, favorite_genres, sim_score):
        genres = movie_row['genres_display']
        director = movie_row['director_display']
        cast = movie_row['cast_display']
        
        reasons = []

        if query_movie_title:
            if sim_score > 0.15:
                reasons.append(f"Shares similar themes and content elements with '{query_movie_title}' ({int(sim_score * 100)}% thematic match)")
            # Check overlap in genres
            if favorite_genres:
                overlap = list(set([g.lower() for g in genres]).intersection(set(favorite_genres)))
                if overlap:
                    reasons.append(f"Fits your preferred genre: {', '.join([o.capitalize() for o in overlap[:2]])}")
            else:
                reasons.append(f"Matches the genres of '{query_movie_title}'")
            
            if director and movie_row['director'] != '':
                reasons.append(f"Directed by {director}")
        else:
            # Profile recommendations
            if favorite_genres:
                overlap = list(set([g.lower() for g in genres]).intersection(set(favorite_genres)))
                if overlap:
                    reasons.append(f"Matches your favorite genres: {', '.join([o.capitalize() for o in overlap[:2]])}")
            
            if movie_row['vote_average'] >= 7.5:
                reasons.append(f"Highly rated by viewers ({movie_row['vote_average']}/10)")
            elif movie_row['popularity'] >= self.df['popularity'].quantile(0.85):
                reasons.append("Trending and popular on CineMatch")

        if not reasons:
            reasons.append("Popular choice that aligns with your profile preferences")

        return " • ".join(reasons)
