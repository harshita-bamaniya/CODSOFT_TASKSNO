import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, Calendar, Clock, Film, Award, RefreshCw, ChevronLeft } from 'lucide-react';
import { movieApi } from '../services/api';
import { UserContext } from '../context/UserContext';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';

const MovieDetails = () => {
  const { id } = useParams();
  const { favorites, ratings, toggleFavorite, rateMovie, viewMovie } = useContext(UserContext);
  
  const [movie, setMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecsLoading, setIsRecsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isFavorite = movie ? favorites.some(m => m.id === movie.id) : false;
  const userRating = movie ? ratings[String(movie.id)] || 0 : 0;
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchMovieData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movieData = await movieApi.getMovieDetail(id);
        setMovie(movieData);
        viewMovie(movieData); // Log as recently viewed
        
        // Fetch recommendations similar to this movie
        setIsRecsLoading(true);
        try {
          const recs = await movieApi.getMovieRecommendations(id, 4);
          setRecommendations(recs);
        } catch (rErr) {
          console.error("Failed to load movie recs", rErr);
        } finally {
          setIsRecsLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError('Movie detail fetch failed. Movie ID might be invalid.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovieData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Analyzing movie details...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'red', fontSize: '1.2rem', marginBottom: '1.5rem' }}>{error || 'Movie not found.'}</p>
        <Link to="/discover" className="btn btn-primary">
          <ChevronLeft size={16} /> Back to Discover
        </Link>
      </div>
    );
  }

  // Parse genres, cast, keywords
  const genres = Array.isArray(movie.genres_display) ? movie.genres_display : JSON.parse(movie.genres_display || '[]');
  const keywords = Array.isArray(movie.keywords_display) ? movie.keywords_display : JSON.parse(movie.keywords_display || '[]');
  const cast = Array.isArray(movie.cast_display) ? movie.cast_display : JSON.parse(movie.cast_display || '[]');

  // Generate poster background gradient
  const gradients = [
    ['#8B5CF6', '#22D3EE'],
    ['#EC4899', '#F43F5E'],
    ['#3B82F6', '#1D4ED8'],
    ['#10B981', '#059669'],
  ];
  const gradIndex = Math.abs(movie.id) % gradients.length;
  const [color1, color2] = gradients[gradIndex];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/discover" style={{ color: 'var(--color-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
          <ChevronLeft size={16} /> Back to Library
        </Link>
      </div>

      {/* Main Movie Presentation */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '3.5rem', marginBottom: '4rem' }}>
        {/* Left Side Poster */}
        <div>
          <div style={{ 
            aspectRatio: '2/3', 
            borderRadius: '16px', 
            background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '2rem',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--color-border)',
            position: 'relative'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>
              CineMatch Spotlight
            </div>
            
            <div style={{ 
              fontFamily: 'var(--font-cinematic)', 
              fontWeight: 800, 
              fontSize: '2rem', 
              lineHeight: 1.2, 
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              margin: '3rem 0'
            }}>
              {movie.title}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', opacity: 0.9 }}>
              <span>{movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
              <span>{movie.director_display || 'Director'}</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button 
              onClick={() => toggleFavorite(movie)}
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} style={{ color: isFavorite ? '#ef4444' : 'inherit' }} />
              {isFavorite ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>

        {/* Right Side Metadata */}
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-cinematic)' }}>
            {movie.title}
          </h1>

          {/* Metadata Badges */}
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-accent-secondary)', fontWeight: 700 }}>
              <Star size={16} fill="currentColor" />
              <span>{movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'} / 10</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 400 }}>({movie.vote_count} votes)</span>
            </div>
            
            {movie.release_date && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Calendar size={16} />
                <span>{movie.release_date}</span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={16} />
              <span>Popularity: {movie.popularity ? movie.popularity.toFixed(1) : '0.0'}</span>
            </div>
          </div>

          {/* Overview */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-accent-secondary)' }}>Overview</h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              {movie.overview || 'No overview available for this movie.'}
            </p>
          </div>

          {/* Genres */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Genres</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {genres.map((g, i) => (
                <span key={i} style={{ padding: '0.35rem 0.75rem', borderRadius: '4px', backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Cast & Crew Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {movie.director_display && (
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Award size={14} /> Director
                </h4>
                <p style={{ fontWeight: 600 }}>{movie.director_display}</p>
              </div>
            )}
            {cast.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Film size={14} /> Starring Cast
                </h4>
                <p style={{ fontWeight: 600 }}>{cast.join(', ')}</p>
              </div>
            )}
          </div>

          {/* 1-5 Star Interactive User Rating */}
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>Rate this movie</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Your rating directly updates your recommendation profile</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hoverRating || userRating);
                return (
                  <button
                    key={star}
                    onClick={() => rateMovie(movie.id, star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{ color: filled ? 'var(--color-accent-primary)' : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'color 0.1s' }}
                  >
                    <Star size={32} fill={filled ? 'currentColor' : 'none'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Feed: Because You Liked This */}
      <section style={{ borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-cinematic)' }}>
          Because You Liked This
        </h2>
        
        {isRecsLoading ? (
          <div className="movie-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : recommendations.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--color-secondary)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No recommendations calculated for this movie.</p>
          </div>
        ) : (
          <div>
            <div className="movie-grid">
              {recommendations.map(rec => (
                <MovieCard key={rec.id} movie={rec} />
              ))}
            </div>
            
            {/* Display list of dynamic explanation strings right below */}
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Recommendation Explanations</h4>
              {recommendations.map(rec => (
                <div key={rec.id} className="glass-panel" style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: '#FFF' }}>{rec.title}</strong>
                  <span style={{ color: 'var(--color-text-secondary)', textAlign: 'right' }}>{rec.explanation}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;
