import React, { useState, useEffect, useContext } from 'react';
import { Sparkles, RefreshCw, BarChart2, Star, Clock, User, Heart, Settings } from 'lucide-react';
import { UserContext } from '../context/UserContext';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import Onboarding from '../components/Onboarding';

const Recommendations = () => {
  const { preferences, ratings, favorites, isOnboarded, setIsOnboarded } = useContext(UserContext);
  
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await movieApi.getPersonalizedRecommendations(preferences, ratings, 12);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      setError('Could not calculate your hybrid recommendations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOnboarded) {
      fetchRecommendations();
    }
  }, [isOnboarded, preferences, ratings]);

  // If user hasn't completed onboarding, render the Onboarding component
  if (!isOnboarded) {
    return <Onboarding />;
  }

  const ratedCount = Object.keys(ratings).length;
  const favoriteGenres = preferences.favoriteGenres || [];

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      {/* Page Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'var(--font-cinematic)' }}>
            <Sparkles size={28} style={{ color: 'var(--color-accent-primary)' }} />
            Personalized For You
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Hybrid AI calculations tailored to your preferences, ratings, and genre watchlists.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setIsOnboarded(false)}
            className="btn btn-secondary"
            title="Edit Taste Preferences"
          >
            <Settings size={16} /> Edit Taste Profile
          </button>
          
          <button 
            onClick={fetchRecommendations} 
            disabled={isLoading}
            className="btn btn-primary"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} /> Recalculate
          </button>
        </div>
      </header>

      {/* User Taste Profile Dashboard */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2.5rem', marginBottom: '4rem' }}>
        {/* Profile Card Summary */}
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderLeftWidth: '4px', borderLeftColor: 'var(--color-accent-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent-secondary)', padding: '0.75rem', borderRadius: '50%' }}>
              <User size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Taste Profile</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Updated just now</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Movies Rated</span>
              <strong style={{ color: 'var(--color-accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Star size={14} fill="currentColor" /> {ratedCount}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Watchlisted</span>
              <strong style={{ color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Heart size={14} fill="currentColor" /> {favorites.length}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Preferred Era</span>
              <strong style={{ textTransform: 'capitalize' }}>
                {preferences.preferredReleasePeriod === '2010s_later' ? 'Modern' : 
                 preferences.preferredReleasePeriod === '2000s' ? '2000s' : 
                 preferences.preferredReleasePeriod === '1990s' ? '90s' : 
                 preferences.preferredReleasePeriod === '1980s_older' ? 'Classic' : 'Any'}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Min Rating Threshold</span>
              <strong style={{ color: 'var(--color-accent-secondary)' }}>
                {preferences.minimumRating === 0 ? 'Any' : `${preferences.minimumRating.toFixed(1)}+`}
              </strong>
            </div>
          </div>
        </div>

        {/* Favorite Genres Interactive Chart */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart2 size={18} style={{ color: 'var(--color-accent-primary)' }} />
            Taste Alignment Breakdown
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {favoriteGenres.map((genre, idx) => {
              // Simulating random but consistent taste values for the bar representation
              const strength = 100 - idx * 12;
              return (
                <div key={genre}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 500 }}>{genre}</span>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{strength}% preference weight</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--color-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${strength}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, var(--color-accent-secondary), var(--color-accent-primary))',
                      borderRadius: '999px'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommendations Output */}
      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-cinematic)' }}>
          Recommended Movies
        </h2>

        {isLoading ? (
          <div className="movie-grid">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-card)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>{error}</p>
            <button onClick={fetchRecommendations} className="btn btn-primary">
              Retry Calculation
            </button>
          </div>
        ) : recommendations.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-card)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>We need to learn a little more about your taste.</p>
            <button onClick={() => setIsOnboarded(false)} className="btn btn-primary">
              Set Preferences
            </button>
          </div>
        ) : (
          <div>
            <div className="movie-grid">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Display list of dynamic explanations below */}
            <div style={{ marginTop: '3.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-cinematic)' }}>
                <Sparkles size={18} style={{ color: 'var(--color-accent-secondary)' }} />
                Why These Movies?
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recommendations.slice(0, 6).map(movie => (
                  <div key={movie.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                    <div>
                      <strong style={{ color: '#FFF' }}>{movie.title}</strong>
                      <span style={{ color: 'var(--color-accent-secondary)', fontWeight: 700, marginLeft: '0.75rem' }}>{movie.match_score}% Match</span>
                    </div>
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>{movie.explanation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Recommendations;
