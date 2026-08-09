import React, { useState, useEffect } from 'react';
import { movieApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import SkeletonCard from '../components/SkeletonCard';
import { Compass, Filter, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

const GENRES = [
  'All', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 
  'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 
  'Horror', 'Mystery', 'Romance', 'Science Fiction', 'Thriller', 'War'
];

const Discover = () => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMovies, setTotalMovies] = useState(0);
  
  const [selectedGenre, setSelectedGenre] = useState('All');
  const limit = 20;

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const genreQuery = selectedGenre === 'All' ? '' : selectedGenre;
        const data = await movieApi.getMovies(page, limit, genreQuery);
        setMovies(data.movies);
        setTotalPages(data.total_pages);
        setTotalMovies(data.total);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch movies. Please check that the backend is running.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, [page, selectedGenre]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    setPage(1); // Reset to page 1 on filter change
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 5rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Compass size={28} style={{ color: 'var(--color-accent-secondary)' }} />
          Discover Movies
        </h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Browse our entire library of over 4,800 movies, filtered by genres.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2.5rem' }}>
        {/* Genre Sidebar */}
        <aside>
          <div className="glass-panel" style={{ padding: '1.5rem', position: 'sticky', top: '92px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.75rem' }}>
              <Filter size={16} /> Genres
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {GENRES.map(genre => {
                const isActive = selectedGenre === genre;
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      textAlign: 'left',
                      fontSize: '0.9rem',
                      fontWeight: isActive ? 600 : 400,
                      backgroundColor: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                      color: isActive ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{genre}</span>
                    {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-accent-primary)' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Movie Grid & Pagination */}
        <main>
          {isLoading ? (
            <div className="movie-grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-card)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={() => setPage(1)} className="btn btn-primary">
                <RefreshCw size={14} /> Try Again
              </button>
            </div>
          ) : movies.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: 'var(--color-card)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
              <p style={{ color: 'var(--color-text-secondary)' }}>No movies found matching this filter.</p>
            </div>
          ) : (
            <>
              {/* Movies Grid */}
              <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                Showing {movies.length} of {totalMovies.toLocaleString()} movies
              </div>
              <div className="movie-grid">
                {movies.map(movie => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '1.5rem', 
                  marginTop: '3.5rem',
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: '2rem'
                }}>
                  <button 
                    onClick={handlePrevPage} 
                    disabled={page === 1}
                    className="btn btn-secondary"
                    style={{ opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  
                  <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-cinematic)', fontWeight: 500 }}>
                    Page <span style={{ color: 'var(--color-text-primary)', fontWeight: 700 }}>{page}</span> of {totalPages}
                  </span>
                  
                  <button 
                    onClick={handleNextPage} 
                    disabled={page === totalPages}
                    className="btn btn-secondary"
                    style={{ opacity: page === totalPages ? 0.4 : 1, cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Discover;
