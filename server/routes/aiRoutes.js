const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const { 
    generatePlaylist,
    getAutoplayRecommendations,
    getLyrics,
    generateDiscoverWeekly
} = require('../controllers/aiController');

// POST /api/ai/generate-playlist
router.post('/generate-playlist', authenticateUser, generatePlaylist);

// POST /api/ai/autoplay
router.post('/autoplay', authenticateUser, getAutoplayRecommendations);

// POST /api/ai/lyrics
router.post('/lyrics', authenticateUser, getLyrics);

// POST /api/ai/discover-weekly
router.post('/discover-weekly', authenticateUser, generateDiscoverWeekly);

module.exports = router;
