import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const gradients = [
  ['#8B5CF6', '#22D3EE'], // Purple to Cyan
  ['#EC4899', '#F43F5E'], // Pink to Rose
  ['#3B82F6', '#1D4ED8'], // Blue to Dark Blue
  ['#10B981', '#059669'], // Green to Emerald
  ['#F59E0B', '#D97706'], // Amber to Orange
  ['#6366F1', '#4F46E5'], // Indigo to Violet
  ['#F43F5E', '#8B5CF6'], // Rose to Purple
  ['#06B6D4', '#3B82F6'], // Cyan to Blue
];

const MovieCard = ({ movie }) => {
  const { favorites, toggleFavorite } = useContext(UserContext);
  const isFavorite = favorites.some(m => m.id === movie.id);
  
  const releaseYear = movie.release_date 
    ? movie.release_date.split('-')[0] 
    : 'N/A';
    
  // Pick gradient deterministically based on movie id
  const gradIndex = Math.abs(movie.id) % gradients.length;
  const [color1, color2] = gradients[gradIndex];
  
  // Custom placeholder poster design
  const cardGradientStyle = {
    background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem',
    color: '#FFF',
    height: '100%',
    width: '100%',
    position: 'relative'
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie.id}`}>
        <div className="card-poster-wrapper">
          {/* Match Score Indicator */}
          {movie.match_score !== undefined && (
            <div className="card-match">
              {movie.match_score}% Match
            </div>
          )}
          
          {/* Vote Average Indicator */}
          <div className="card-rating">
            <Star size={12} fill="currentColor" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}
          </div>
          
          {/* Dynamic Editorial Placeholder Poster */}
          <div style={cardGradientStyle}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>
              CineMatch Feature
            </div>
            <div style={{ 
              fontFamily: 'var(--font-cinematic)', 
              fontWeight: 800, 
              fontSize: '1.25rem', 
              lineHeight: 1.25, 
              wordBreak: 'break-word',
              margin: '1.5rem 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              {movie.title}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, display: 'flex', gap: '0.5rem' }}>
              <span>{releaseYear}</span>
              <span>•</span>
              <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {movie.genres_display && movie.genres_display[0] ? movie.genres_display[0] : 'Drama'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="card-info">
          <h3 className="card-title" title={movie.title}>{movie.title}</h3>
          <div className="card-meta">
            <span>{releaseYear}</span>
            <button 
              onClick={handleFavoriteClick} 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              aria-label="Add to favorites"
              title="Add to watchlist"
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
