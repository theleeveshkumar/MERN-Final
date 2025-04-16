// API URL
const API_URL = 'http://localhost:5000/podcasts';

// DOM Elements
const homeLink = document.getElementById('home-link');
const savedLink = document.getElementById('saved-link');
const homeSection = document.getElementById('home-section');
const savedSection = document.getElementById('saved-section');
const podcastsContainer = document.getElementById('podcasts-container');
const savedPodcastsContainer = document.getElementById('saved-podcasts-container');
const audioPlayer = document.getElementById('audio-player');
const playerImage = document.getElementById('player-image');
const playerTitle = document.getElementById('player-title');
const playerDescription = document.getElementById('player-description');
const playPauseBtn = document.getElementById('play-pause-btn');
const previousBtn = document.getElementById('previous-btn');
const nextBtn = document.getElementById('next-btn');
const progressBar = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// State
let podcasts = [];
let currentPodcastIndex = -1;
let audioElement = new Audio();
let isPlaying = false;

// Event Listeners
document.addEventListener('DOMContentLoaded', initialize);
homeLink.addEventListener('click', showHomeSection);
savedLink.addEventListener('click', showSavedSection);
playPauseBtn.addEventListener('click', togglePlayPause);
previousBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);
audioElement.addEventListener('timeupdate', updateProgress);
audioElement.addEventListener('ended', handleAudioEnded);
volumeSlider.addEventListener('input', updateVolume);
searchButton.addEventListener('click', searchPodcasts);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPodcasts();
});

// Functions
function initialize() {
    fetchPodcasts();
    showHomeSection();
}

async function fetchPodcasts() {
    try {
        podcastsContainer.innerHTML = '<div class="loading">Loading podcasts...</div>';
        
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch podcasts');
        }
        
        podcasts = await response.json();
        renderPodcasts();
        updateSavedPodcasts();
    } catch (error) {
        console.error('Error fetching podcasts:', error);
        podcastsContainer.innerHTML = '<div class="error">Failed to load podcasts. Please try again later.</div>';
    }
}

function renderPodcasts(filteredPodcasts = null) {
    const podcastsToRender = filteredPodcasts || podcasts;
    podcastsContainer.innerHTML = '';
    
    if (podcastsToRender.length === 0) {
        podcastsContainer.innerHTML = '<div class="loading">No podcasts found</div>';
        return;
    }
    
    podcastsToRender.forEach((podcast, index) => {
        const podcastCard = createPodcastCard(podcast, index);
        podcastsContainer.appendChild(podcastCard);
    });
}

function updateSavedPodcasts() {
    savedPodcastsContainer.innerHTML = '';
    
    const savedPodcastsList = podcasts.filter(podcast => podcast.saved);
    
    if (savedPodcastsList.length === 0) {
        savedPodcastsContainer.innerHTML = '<div class="loading">No saved podcasts yet</div>';
        return;
    }
    
    savedPodcastsList.forEach((podcast) => {
        const index = podcasts.findIndex(p => p._id === podcast._id);
        const podcastCard = createPodcastCard(podcast, index, true);
        savedPodcastsContainer.appendChild(podcastCard);
    });
}

function createPodcastCard(podcast, index, isSaved = false) {
    const template = document.getElementById('podcast-template');
    const card = template.content.cloneNode(true);
    
    const title = card.querySelector('.podcast-title');
    const description = card.querySelector('.podcast-description');
    const playButton = card.querySelector('.play-button');
    const saveButton = card.querySelector('.save-button');
    
    title.textContent = podcast.title;
    description.textContent = podcast.description;
    
    if (podcast.saved) {
        saveButton.classList.add('saved');
        saveButton.textContent = 'Saved';
    }
    
    // Set up event listeners
    playButton.addEventListener('click', () => {
        playSong(index);
    });
    
    saveButton.addEventListener('click', () => {
        toggleSave(podcast._id, isSaved);
    });
    
    return card;
}

function toggleSave(podcastId, isSaved) {
    // Find the podcast in our local state
    const podcastIndex = podcasts.findIndex(p => p._id === podcastId);
    if (podcastIndex === -1) return;
    
    const newSavedState = !podcasts[podcastIndex].saved;
    
    // Update server
    fetch(`${API_URL}/${podcastId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ saved: newSavedState }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update podcast');
        }
        return response.json();
    })
    .then(updatedPodcast => {
        // Update local state
        podcasts[podcastIndex].saved = updatedPodcast.saved;
        
        // Update UI
        renderPodcasts();
        updateSavedPodcasts();
        
        // If we're in saved section and removing a podcast, handle that
        if (isSaved && !updatedPodcast.saved && currentPodcastIndex === podcastIndex) {
            audioPlayer.classList.add('hidden');
            audioElement.pause();
            isPlaying = false;
        }
    })
    .catch(error => {
        console.error('Error updating podcast:', error);
        alert('Failed to update podcast. Please try again.');
    });
}

function playSong(index) {
    if (index < 0 || index >= podcasts.length) return;
    
    const podcast = podcasts[index];
    
    // Update player UI
    playerImage.src = 'https://via.placeholder.com/60'; // Use a proper thumbnail if available
    playerTitle.textContent = podcast.title;
    playerDescription.textContent = podcast.description;
    
    // Update audio source
    if (currentPodcastIndex !== index) {
        audioElement.src = podcast.audioFile;
        currentPodcastIndex = index;
    }
    
    // Show player and play
    audioPlayer.classList.remove('hidden');
    togglePlayPause(true);
}

function togglePlayPause(forcePlay = null) {
    if (forcePlay === true || !isPlaying) {
        audioElement.play().catch(error => {
            console.error('Error playing audio:', error);
            alert('Failed to play podcast. Please try again.');
        });
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    } else {
        audioElement.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        isPlaying = false;
    }
}

function playPrevious() {
    if (currentPodcastIndex > 0) {
        playSong(currentPodcastIndex - 1);
    }
}

function playNext() {
    if (currentPodcastIndex < podcasts.length - 1) {
        playSong(currentPodcastIndex + 1);
    }
}

function updateProgress() {
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration || 0;
    
    // Update progress bar
    if (!isNaN(duration) && duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }
    
    // Update time displays
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

function handleAudioEnded() {
    playNext();
}

function updateVolume() {
    audioElement.volume = volumeSlider.value;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function showHomeSection() {
    homeLink.classList.add('active');
    savedLink.classList.remove('active');
    homeSection.classList.remove('hidden');
    savedSection.classList.add('hidden');
}

function showSavedSection() {
    savedLink.classList.add('active');
    homeLink.classList.remove('active');
    savedSection.classList.remove('hidden');
    homeSection.classList.add('hidden');
    updateSavedPodcasts();
}

function searchPodcasts() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderPodcasts();
        return;
    }
    
    const filteredPodcasts = podcasts.filter(podcast => 
        podcast.title.toLowerCase().includes(searchTerm) || 
        podcast.description.toLowerCase().includes(searchTerm)
    );
    
    renderPodcasts(filteredPodcasts);
}