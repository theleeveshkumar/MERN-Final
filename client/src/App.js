import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Saved from './components/Saved';
import AudioPlayer from './components/AudioPlayer';
import './App.css';

const App = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement] = useState(new Audio());
  
  useEffect(() => {
    fetchPodcasts();
    
    // Set up audio element event listeners
    audioElement.addEventListener('ended', handleAudioEnded);
    
    return () => {
      audioElement.removeEventListener('ended', handleAudioEnded);
      audioElement.pause();
    };
  }, []);

  const fetchPodcasts = async () => {
    try {
      const response = await fetch('http://localhost:5000/podcasts');
      if (!response.ok) {
        throw new Error('Failed to fetch podcasts');
      }
      const data = await response.json();
      setPodcasts(data);
    } catch (error) {
      console.error('Error fetching podcasts:', error);
    }
  };

  const playPodcast = (podcast) => {
    // If selecting a new podcast
    if (!currentPodcast || currentPodcast._id !== podcast._id) {
      audioElement.src = podcast.audioFile;
      setCurrentPodcast(podcast);
    }
    
    audioElement.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else if (currentPodcast) {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    // Find next podcast in the list
    if (currentPodcast) {
      const currentIndex = podcasts.findIndex(p => p._id === currentPodcast._id);
      if (currentIndex < podcasts.length - 1) {
        const nextPodcast = podcasts[currentIndex + 1];
        playPodcast(nextPodcast);
      } else {
        setIsPlaying(false);
      }
    }
  };

  const playNext = () => {
    if (currentPodcast) {
      const currentIndex = podcasts.findIndex(p => p._id === currentPodcast._id);
      if (currentIndex < podcasts.length - 1) {
        const nextPodcast = podcasts[currentIndex + 1];
        playPodcast(nextPodcast);
      }
    }
  };

  const playPrevious = () => {
    if (currentPodcast) {
      const currentIndex = podcasts.findIndex(p => p._id === currentPodcast._id);
      if (currentIndex > 0) {
        const previousPodcast = podcasts[currentIndex - 1];
        playPodcast(previousPodcast);
      }
    }
  };

  const toggleSave = async (podcastId) => {
    const podcastIndex = podcasts.findIndex(p => p._id === podcastId);
    if (podcastIndex === -1) return;
    
    const podcast = podcasts[podcastIndex];
    const newSavedState = !podcast.saved;
    
    try {
      const response = await fetch(`http://localhost:5000/podcasts/${podcastId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saved: newSavedState }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update podcast');
      }
      
      const updatedPodcast = await response.json();
      
      // Update local state
      const updatedPodcasts = [...podcasts];
      updatedPodcasts[podcastIndex] = updatedPodcast;
      setPodcasts(updatedPodcasts);
      
      // If this is the current podcast, update that too
      if (currentPodcast && currentPodcast._id === podcastId) {
        setCurrentPodcast(updatedPodcast);
      }
    } catch (error) {
      console.error('Error updating podcast:', error);
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  podcasts={podcasts} 
                  playPodcast={playPodcast} 
                  toggleSave={toggleSave} 
                />
              } 
            />
            <Route 
              path="/saved" 
              element={
                <Saved 
                  podcasts={podcasts.filter(podcast => podcast.saved)} 
                  playPodcast={playPodcast} 
                  toggleSave={toggleSave} 
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        
        {currentPodcast && (
          <AudioPlayer 
            podcast={currentPodcast}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            playNext={playNext}
            playPrevious={playPrevious}
            audioElement={audioElement}
          />
        )}
      </div>
    </Router>
  );
};

export default App;