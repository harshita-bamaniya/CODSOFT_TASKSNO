import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Film, Compass, Sparkles, Heart, HelpCircle, Trash2 } from 'lucide-react';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
  const { clearTasteProfile, isOnboarded } = useContext(UserContext);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <Film className="logo-icon" size={24} style={{ color: 'var(--color-accent-secondary)' }} />
          CineMatch<span>AI</span>
        </Link>
        
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          
          <NavLink to="/discover" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Compass size={16} /> Discover
            </span>
          </NavLink>
          
          <NavLink to="/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={16} /> Recommendations
            </span>
          </NavLink>
          
          <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <Heart size={16} /> Watchlist
            </span>
          </NavLink>
          
          <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <HelpCircle size={16} /> How It Works
            </span>
          </NavLink>
        </div>

        {isOnboarded && (
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset your taste profile and history?")) {
                clearTasteProfile();
              }
            }}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
            title="Reset Taste Profile"
          >
            <Trash2 size={14} /> Reset
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
