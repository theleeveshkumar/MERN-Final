import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="https://plus.unsplash.com/premium_photo-1664195074777-a7c40926f5c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHBvZGNhc3R8ZW58MHx8MHx8fDA%3D" alt="Logo" />
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