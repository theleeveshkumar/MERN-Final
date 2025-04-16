import React from 'react';
import PodcastCard from './PodcastCard';
import './Saved.css';

const Saved = ({ podcasts, playPodcast, toggleSave }) => {
  return (
    <div className="saved-section">
      <header>
        <h1>Saved Podcasts</h1>
      </header>
      
      <div className="podcasts-grid">
        {podcasts.length === 0 ? (
          <div className="loading">No saved podcasts yet</div>
        ) : (
          podcasts.map(podcast => (
            <PodcastCard 
              key={podcast._id}
              podcast={podcast}
              playPodcast={playPodcast}
              toggleSave={toggleSave}
              isSaved={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Saved;