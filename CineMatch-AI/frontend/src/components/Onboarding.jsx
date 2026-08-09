import React, { useState, useContext } from 'react';
import { Sparkles, Sliders, Calendar } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const AVAILABLE_GENRES = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 
  'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War'
];

const Onboarding = () => {
  const { savePreferences } = useContext(UserContext);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minRating, setMinRating] = useState(6.0);
  const [period, setPeriod] = useState('Any');

  const toggleGenre = (genre) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre) 
        : [...prev, genre]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGenres.length === 0) {
      alert("Please select at least one genre to help us learn your taste.");
      return;
    }
    savePreferences({
      favoriteGenres: selectedGenres,
      minimumRating: minRating,
      preferredReleasePeriod: period
    });
  };

  return (
    <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel onboarding-card" style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '0.75rem', 
            borderRadius: '50%', 
            background: 'rgba(139, 92, 246, 0.1)', 
            color: 'var(--color-accent-primary)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={32} />
          </div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Let's learn your taste.</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>
            Tell us what you love and we'll personalize your recommendations.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Genres */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>1.</span> Select Your Favorite Genres
            </h3>
            <div className="genre-grid">
              {AVAILABLE_GENRES.map(genre => {
                const isActive = selectedGenres.includes(genre);
                return (
                  <div
                    key={genre}
                    onClick={() => toggleGenre(genre)}
                    className={`genre-bubble ${isActive ? 'active' : ''}`}
                  >
                    {genre}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Section 2: Minimum Rating */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={16} style={{ color: 'var(--color-accent-secondary)' }} />
                Minimum Rating
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="9" 
                  step="0.5" 
                  value={minRating} 
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  style={{ 
                    width: '100%', 
                    accentColor: 'var(--color-accent-primary)',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                  <span>Any Rating</span>
                  <span style={{ color: 'var(--color-accent-secondary)', fontWeight: 700 }}>
                    {minRating === 0 ? 'Any' : `${minRating.toFixed(1)}+ Rating`}
                  </span>
                  <span>9.0+ Excellent</span>
                </div>
              </div>
            </div>

            {/* Section 3: Release Period */}
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} style={{ color: 'var(--color-accent-secondary)' }} />
                Release Era
              </h3>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-secondary)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="Any">Any Era</option>
                <option value="2010s_later">Modern (2010s - Present)</option>
                <option value="2000s">Millennium (2000s)</option>
                <option value="1990s">Nostalgia (1990s)</option>
                <option value="1980s_older">Classic (1980s & older)</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}>
              Generate Recommendations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
