const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');

// Route to get trending music
router.get('/trending', musicController.getTrending);

// Route to search for music by query string (e.g., /api/music/search?q=song+name)
router.get('/search', musicController.searchMusic);

// Route to resolve Spotify track to YouTube video
router.get('/resolve', musicController.resolveTrack);

// Route to get specific video details by ID
router.get('/video/:id', musicController.getVideoDetails);

// Route to get new releases
router.get('/new-releases', musicController.getNewReleases);

// Route to get recommended music
router.get('/recommended', musicController.getRecommended);

// Route to get popular artists
router.get('/popular-artists', musicController.getPopularArtists);

module.exports = router;
