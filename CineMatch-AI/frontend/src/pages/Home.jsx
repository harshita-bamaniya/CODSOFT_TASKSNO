import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, TrendingUp, Cpu, X, Play } from 'lucide-react';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { UserContext } from '../context/UserContext';

const Home = () => {
  const navigate = useNavigate();
  const { isOnboarded } = useContext(UserContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  // Debounce search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const results = await movieApi.searchMovies(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
        setSearchError('Search failed. Please check backend.');
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrending = async () => {
      setIsTrendingLoading(true);
      setTrendingError(null);
      try {
        const data = await movieApi.getTrending(8);
        setTrendingMovies(data);
      } catch (err) {
        console.error(err);
        setTrendingError('Could not load trending movies.');
      } finally {
        setIsTrendingLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      {/* 1. Cinematic Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '5rem 0', 
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 1rem',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--color-border)',
          fontSize: '0.85rem',
          color: 'var(--color-accent-secondary)',
          marginBottom: '1.5rem',
          fontWeight: 600,
          fontFamily: 'var(--font-cinematic)'
        }}>
          <Cpu size={14} /> AI-powered movie discovery platform
        </div>
        
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 800, 
          lineHeight: 1.1, 
          marginBottom: '1rem',
          maxWidth: '800px',
          fontFamily: 'var(--font-cinematic)'
        }}>
          Your next favorite movie is <span className="text-gradient">waiting.</span>
        </h1>
        
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'var(--color-text-secondary)', 
          maxWidth: '600px', 
          marginBottom: '2.5rem',
          lineHeight: 1.6
        }}>
          CineMatch combines content similarity, taste profiling, and community ratings to curate recommendations personalized just for you.
        </p>

        {/* Search Bar */}
        <div style={{ width: '100%', maxWidth: '600px', marginBottom: '2rem' }}>
          <div className="input-group">
            <Search className="input-icon" />
            <input
              type="text"
              placeholder="Search for movies (e.g. Interstellar, Avatar, Iron Man...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field"
              style={{ paddingRight: '3rem' }}
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                style={{ 
                  position: 'absolute', 
                  right: '1rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Primary CTA */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => navigate(isOnboarded ? '/recommendations' : '/recommendations')}
            className="btn btn-primary"
          >
            <Sparkles size={16} /> Find My Recommendations
          </button>
          <Link to="/discover" className="btn btn-secondary">
            Browse All Movies
          </Link>
        </div>
      </section>

      {/* 2. Search Results Section */}
      {searchQuery && (
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Search Results for "{searchQuery}"
          </h2>
          {isSearching ? (
            <div className="movie-grid">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : searchError ? (
            <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-secondary)', borderRadius: '12px' }}>
              <p style={{ color: 'red' }}>{searchError}</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--color-secondary)', borderRadius: '12px' }}>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>No movies found. Try another title, genre, or keyword.</p>
            </div>
          ) : (
            <div className="movie-grid">
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* 3. Trending / Popular Section */}
      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={22} style={{ color: 'var(--color-accent-secondary)' }} /> Trending Now
          </h2>
          <Link to="/discover" style={{ color: 'var(--color-accent-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            View all
          </Link>
        </div>

        {isTrendingLoading ? (
          <div className="movie-grid">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : trendingError ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-secondary)', borderRadius: '12px' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>{trendingError}</p>
          </div>
        ) : (
          <div className="movie-grid">
            {trendingMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section style={{ marginBottom: '5rem', padding: '4rem', background: 'var(--color-card)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>
          How CineMatch AI Works
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {[
            { step: '01', title: 'Choose', desc: 'Select favorite genres or rate movies you have already watched.' },
            { step: '02', title: 'Analyze', desc: 'Our ML pipeline processes plot overviews, genres, cast, and directors.' },
            { step: '03', title: 'Recommend', desc: 'Hybrid calculations combine TF-IDF similarity vectors with your preferences.' },
            { step: '04', title: 'Discover', desc: 'Explore personalized recommendations along with explainable match signals.' }
          ].map((item, idx) => (
            <div key={idx} style={{ position: 'relative' }}>
              <div style={{ 
                fontFamily: 'var(--font-cinematic)', 
                fontWeight: 800, 
                fontSize: '3rem', 
                color: 'rgba(255, 255, 255, 0.03)',
                position: 'absolute',
                top: '-2.5rem',
                left: '0',
                lineHeight: 1
              }}>
                {item.step}
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-accent-primary)' }}>•</span> {item.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ML Feature Section */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', padding: '2rem 0' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: 1.25 }}>
            Real Machine Learning. <br/>No hardcoded results.
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Unlike generic platforms that hardcode "similar movies" lists, CineMatch AI parses movie features programmatically. By combining NLP TF-IDF text representations with customized user interaction logs, the recommendation vectors update in real-time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: 'var(--color-accent-secondary)', padding: '0.5rem', borderRadius: '8px' }}>
                <Play size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>TF-IDF + Cosine Similarity</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Plots, keywords, genres, actors, and directors parsed into vector space.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--color-accent-primary)', padding: '0.5rem', borderRadius: '8px' }}>
                <Sparkles size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Dynamic Explanations</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Every recommendation includes a query breakdown showing the exact metadata overlaps.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeftWidth: '4px', borderLeftColor: 'var(--color-accent-primary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
            <span style={{ fontWeight: 600 }}>Algorithm Weighting Config</span>
            <span style={{ color: 'var(--color-accent-secondary)', fontSize: '0.85rem' }}>Local Python Scikit-Learn</span>
          </div>
          {[
            { label: 'Content Similarity (TF-IDF Vector)', value: '60%' },
            { label: 'User Genre/Era Preference Match', value: '20%' },
            { label: 'Movie Popularity & Vote Signal', value: '20%' }
          ].map((item, idx) => (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <span>{item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--color-accent-primary)' }}>{item.value}</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--color-secondary)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: item.value, height: '100%', background: 'linear-gradient(90deg, var(--color-accent-secondary), var(--color-accent-primary))' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/how-it-works" className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.5rem' }}>
              Deep Dive into the math
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
