import React, { useState } from 'react';
import PodcastCard from './PodcastCard';
import './Home.css';

const Home = ({ podcasts, playPodcast, toggleSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPodcasts = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    podcast.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled automatically through the filter above
  };
  
  return (
    <div className="home-section">
      <header>
        <h1>Featured Podcasts</h1>
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search podcasts..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </header>
      
      <div className="podcasts-grid">
        {filteredPodcasts.length === 0 ? (
          <div className="loading">
            {searchTerm ? 'No podcasts match your search' : 'Loading podcasts...'}
          </div>
        ) : (
          filteredPodcasts.map(podcast => (
            <PodcastCard 
              key={podcast._id}
              podcast={podcast}
              playPodcast={playPodcast}
              toggleSave={toggleSave}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;