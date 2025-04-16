// index.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Podcast Schema
const podcastSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    audioFile: { type: String, required: true },
    saved: { type: Boolean, default: false }
});

const Podcast = mongoose.model('Podcast', podcastSchema);

// Routes

// GET all podcasts
app.get('/podcasts', async (req, res) => {
    try {
        const podcasts = await Podcast.find();
        res.json(podcasts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new podcast
app.post('/podcasts', async (req, res) => {
    const podcast = new Podcast({
        title: req.body.title,
        description: req.body.description,
        audioFile: req.body.audioFile
    });

    try {
        const newPodcast = await podcast.save();
        res.status(201).json(newPodcast);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update saved field
app.put('/podcasts/:id', async (req, res) => {
    try {
        const podcast = await Podcast.findById(req.params.id);
        if (!podcast) {
            return res.status(404).json({ message: 'Podcast not found' });
        }

        podcast.saved = req.body.saved;
        const updated = await podcast.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
