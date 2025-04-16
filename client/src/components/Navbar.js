import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="https://via.placeholder.com/40" alt="Logo" />
        <span>Podcast Hub</span>
      </div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          Home
        </NavLink>
        <NavLink to="/saved" className={({ isActive }) => isActive ? 'active' : ''}>
          Saved Podcasts
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;