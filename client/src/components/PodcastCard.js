import React from 'react';
import './PodcastCard.css';

const PodcastCard = ({ podcast, playPodcast, toggleSave, isSaved }) => {
  return (
    <div className="podcast-card">
      <div className="podcast-image">
        <img src="https://via.placeholder.com/300" alt={`${podcast.title} cover`} />
        <button 
          className="play-button"
          onClick={() => playPodcast(podcast)}
          aria-label="Play podcast"
        >
          <i className="fas fa-play"></i>
        </button>
      </div>
      <div className="podcast-info">
        <h3 className="podcast-title">{podcast.title}</h3>
        <p className="podcast-description">{podcast.description}</p>
        <button 
          className={`save-button ${podcast.saved ? 'saved' : ''}`}
          onClick={() => toggleSave(podcast._id)}
        >
          {podcast.saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default PodcastCard;