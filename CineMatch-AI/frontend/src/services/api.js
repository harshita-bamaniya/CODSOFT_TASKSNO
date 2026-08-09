const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.message || `Request failed with status: ${response.status}`;
    throw new Error(message);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API operation failed');
  }
  return result.data;
};

export const movieApi = {
  getHealth: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },

  getMovies: async (page = 1, limit = 20, genre = '') => {
    const genreParam = genre ? `&genre=${encodeURIComponent(genre)}` : '';
    const response = await fetch(`${API_BASE_URL}/movies?page=${page}&limit=${limit}${genreParam}`);
    return handleResponse(response);
  },

  searchMovies: async (query) => {
    const response = await fetch(`${API_BASE_URL}/movies/search?q=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  getTrending: async (limit = 20) => {
    const response = await fetch(`${API_BASE_URL}/trending?limit=${limit}`);
    return handleResponse(response);
  },

  getMovieDetail: async (id) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`);
    return handleResponse(response);
  },

  getMovieRecommendations: async (id, limit = 12) => {
    const response = await fetch(`${API_BASE_URL}/movies/${id}/recommendations?limit=${limit}`);
    return handleResponse(response);
  },

  getPersonalizedRecommendations: async (preferences, ratings, limit = 12) => {
    const payload = {
      user_preferences: preferences,
      user_ratings: ratings,
      top_n: limit
    };
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    return handleResponse(response);
  }
};
