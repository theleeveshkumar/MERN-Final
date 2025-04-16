import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ podcast, isPlaying, togglePlayPause, playNext, playPrevious, audioElement }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const progressRef = useRef(null);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(audioElement.currentTime);
      setDuration(audioElement.duration || 0);
    };

    audioElement.addEventListener('timeupdate', updateTime);
    audioElement.addEventListener('loadedmetadata', updateTime);
    
    // Set initial volume
    audioElement.volume = volume;
    
    return () => {
      audioElement.removeEventListener('timeupdate', updateTime);
      audioElement.removeEventListener('loadedmetadata', updateTime);
    };
  }, [audioElement, volume]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const progressWidth = progressRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const progressPercent = clickX / progressWidth;
    
    audioElement.currentTime = progressPercent * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioElement.volume = newVolume;
  };

  return (
    <div className="audio-player">
      <div className="player-info">
        <img id="player-image" src="https://via.placeholder.com/60" alt="Podcast Cover" />
        <div className="player-details">
          <h3 id="player-title">{podcast.title}</h3>
          <p id="player-description">{podcast.description}</p>
        </div>
      </div>
      
      <div className="player-controls">
        <button onClick={playPrevious} aria-label="Previous podcast">
          <i className="fas fa-step-backward"></i>
        </button>
        
        <button onClick={togglePlayPause} id="play-pause-btn" aria-label={isPlaying ? "Pause" : "Play"}>
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
        
        <button onClick={playNext} aria-label="Next podcast">
          <i className="fas fa-step-forward"></i>
        </button>
        
        <div className="progress-container">
          <span id="current-time">{formatTime(currentTime)}</span>
          <div 
            className="progress-bar" 
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div 
              id="progress" 
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <span id="duration">{formatTime(duration)}</span>
        </div>
        
        <div className="volume-container">
          <i className="fas fa-volume-up"></i>
          <input 
            type="range" 
            id="volume-slider" 
            min="0" 
            max="1" 
            step="0.1" 
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;