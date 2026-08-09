import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('cinematch_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('cinematch_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('cinematch_preferences');
    return saved ? JSON.parse(saved) : {
      favoriteGenres: [],
      minimumRating: 0.0,
      preferredReleasePeriod: 'Any'
    };
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    const saved = localStorage.getItem('cinematch_recently_viewed');
    return saved ? JSON.parse(saved) : [];
  });

  const [isOnboarded, setIsOnboarded] = useState(() => {
    const saved = localStorage.getItem('cinematch_onboarded');
    return saved === 'true';
  });

  // Sync state to local storage on modifications
  useEffect(() => {
    localStorage.setItem('cinematch_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('cinematch_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('cinematch_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('cinematch_recently_viewed', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  useEffect(() => {
    localStorage.setItem('cinematch_onboarded', String(isOnboarded));
  }, [isOnboarded]);

  const toggleFavorite = (movie) => {
    setFavorites(prev => {
      const exists = prev.some(m => m.id === movie.id);
      if (exists) {
        return prev.filter(m => m.id !== movie.id);
      } else {
        return [...prev, movie];
      }
    });
  };

  const rateMovie = (movieId, rating) => {
    setRatings(prev => ({
      ...prev,
      [String(movieId)]: rating
    }));
  };

  const viewMovie = (movie) => {
    setRecentlyViewed(prev => {
      // Filter out duplicate if it exists and put it at the front of the list
      const filtered = prev.filter(m => m.id !== movie.id);
      return [movie, ...filtered].slice(0, 10); // keep only top 10 recent
    });
  };

  const savePreferences = (prefs) => {
    setPreferences(prefs);
    setIsOnboarded(true);
  };

  const clearTasteProfile = () => {
    setFavorites([]);
    setRatings({});
    setPreferences({
      favoriteGenres: [],
      minimumRating: 0.0,
      preferredReleasePeriod: 'Any'
    });
    setRecentlyViewed([]);
    setIsOnboarded(false);
  };

  return (
    <UserContext.Provider value={{
      favorites,
      ratings,
      preferences,
      recentlyViewed,
      isOnboarded,
      toggleFavorite,
      rateMovie,
      viewMovie,
      savePreferences,
      clearTasteProfile,
      setIsOnboarded
    }}>
      {children}
    </UserContext.Provider>
  );
};
