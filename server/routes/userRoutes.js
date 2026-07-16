const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/user/profile
router.get('/profile', authenticateUser, (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// PUT /api/user/profile
router.put('/profile', authenticateUser, async (req, res) => {
    try {
        const { name, email, photoURL, password, preferences } = req.body;
        const user = req.user;
        
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (photoURL !== undefined) user.photoURL = photoURL;
        if (preferences) user.preferences = { ...user.preferences, ...preferences };
        if (password) {
            const bcrypt = require('bcrypt');
            user.password = await bcrypt.hash(password, 10);
        }
        
        console.log(`[Profile Update] Attempting to save profile for user: ${user._id}`);
        await user.save();
        console.log(`[Profile Update] Successfully saved profile for user: ${user._id}`);
        
        // Hide password in output
        const responseUser = { ...user.toObject ? user.toObject() : user };
        delete responseUser.password;
        
        res.status(200).json(responseUser);
    } catch (error) {
        console.error('[Profile Update] Error saving profile:', error);
        res.status(500).json({ error: 'Failed to update user profile' });
    }
});

module.exports = router;
