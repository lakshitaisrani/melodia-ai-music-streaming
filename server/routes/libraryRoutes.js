const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();

// POST /api/library/like/:videoId
router.post('/like/:videoId', authenticateUser, async (req, res) => {
    try {
        const { videoId } = req.params;
        const { title, artist, thumbnail, duration } = req.body;
        const user = req.user;

        // Check if already liked
        const exists = user.likedSongs.some(song => song.videoId === videoId);
        if (exists) {
            return res.status(400).json({ error: 'Song already liked' });
        }

        user.likedSongs.unshift({
            videoId,
            title,
            artist,
            thumbnail,
            duration
        });

        await user.save();
        res.status(200).json(user.likedSongs);
    } catch (error) {
        console.error('Error liking song:', error);
        res.status(500).json({ error: 'Failed to like song' });
    }
});

// DELETE /api/library/like/:videoId
router.delete('/like/:videoId', authenticateUser, async (req, res) => {
    try {
        const { videoId } = req.params;
        const user = req.user;

        user.likedSongs = user.likedSongs.filter(song => song.videoId !== videoId);
        await user.save();
        
        res.status(200).json(user.likedSongs);
    } catch (error) {
        console.error('Error unliking song:', error);
        res.status(500).json({ error: 'Failed to unlike song' });
    }
});

// GET /api/library/liked
router.get('/liked', authenticateUser, async (req, res) => {
    try {
        res.status(200).json(req.user.likedSongs);
    } catch (error) {
        console.error('Error fetching liked songs:', error);
        res.status(500).json({ error: 'Failed to fetch liked songs' });
    }
});

module.exports = router;
