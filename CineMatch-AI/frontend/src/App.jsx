import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Discover from './pages/Discover';
import MovieDetails from './pages/MovieDetails';
import Recommendations from './pages/Recommendations';
import Favorites from './pages/Favorites';
import HowItWorks from './pages/HowItWorks';

function App() {
  return (
    <UserProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/movies/:id" element={<MovieDetails />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
