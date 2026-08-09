import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Trash2 } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
  const { favorites, clearTasteProfile } = useContext(UserContext);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-cinematic)' }}>
            <Heart size={28} style={{ color: 'red' }} fill="red" />
            Your Watchlist
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Movies you have saved to watch later.
          </p>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div style={{ 
          padding: '5rem 2rem', 
          textAlign: 'center', 
          backgroundColor: 'var(--color-card)', 
          borderRadius: '24px', 
          border: '1px dashed var(--color-border)',
          maxWidth: '600px',
          margin: '3rem auto'
        }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '1rem', 
            borderRadius: '50%', 
            background: 'rgba(255, 255, 255, 0.02)', 
            color: 'var(--color-text-secondary)',
            marginBottom: '1.5rem'
          }}>
            <Heart size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-cinematic)' }}>Your watchlist is empty</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '350px', margin: '0 auto 2rem' }}>
            Explore the movie library to find titles you want to watch and click the heart icon.
          </p>
          <Link to="/discover" className="btn btn-primary">
            <Compass size={16} /> Explore Movies
          </Link>
        </div>
      ) : (
        <div className="movie-grid">
          {favorites.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
