const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const axios = require('axios');
const User = require('../models/User');
const mockDb = require('../services/mockDb');

const JWT_SECRET = process.env.JWT_SECRET || 'melodia_secret_key_12345';

// POST /api/auth/firebase
router.post('/firebase', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: 'idToken parameter is required' });
    }

    try {
        const firebaseAuth = require('../config/firebaseAdmin');
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;
        const lowerEmail = email ? email.toLowerCase() : '';

        // Find or create user
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ email: lowerEmail });
            if (!user) {
                user = new User({
                    firebaseUid: uid,
                    name: name || 'Firebase User',
                    email: lowerEmail,
                    photoURL: picture || null
                });
                await user.save();
            } else if (!user.firebaseUid) {
                user.firebaseUid = uid;
                await user.save();
            }
        } else {
            // Mock DB fallback
            user = mockDb.getUserByEmail(lowerEmail);
            if (!user) {
                user = mockDb.createUser({
                    name: name || 'Firebase User',
                    email: lowerEmail,
                    photoURL: picture || null
                });
                user.firebaseUid = uid;
            }
        }

        // Create JWT token
        const token = jwt.sign(
            { uid: user._id || user.firebaseUid, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                likedSongs: user.likedSongs || []
            }
        });
    } catch (error) {
        console.error('Error during Firebase authentication:', error);
        res.status(500).json({ error: 'Firebase authentication failed' });
    }
});

// POST /api/auth/google
router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ error: 'idToken parameter is required' });
    }

    try {
        const firebaseAuth = require('../config/firebaseAdmin');
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);
        const { uid, email, name, picture } = decodedToken;
        const lowerEmail = email ? email.toLowerCase() : '';

        // Find or create user
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findOne({ email: lowerEmail });
            if (!user) {
                user = new User({
                    firebaseUid: uid,
                    name: name || 'Google User',
                    email: lowerEmail,
                    photoURL: picture || null
                });
                await user.save();
            }
        } else {
            // Mock DB fallback
            user = mockDb.getUserByEmail(lowerEmail);
            if (!user) {
                user = mockDb.createUser({
                    name: name || 'Google User',
                    email: lowerEmail,
                    photoURL: picture || null
                });
                user.firebaseUid = uid;
            }
        }

        // Create JWT token
        const token = jwt.sign(
            { uid: user._id || user.firebaseUid, email: user.email }, 
            JWT_SECRET, 
            { expiresIn: '7d' }
        );

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                likedSongs: user.likedSongs || []
            }
        });
    } catch (error) {
        console.error('Error during Google authentication:', error);
        res.status(500).json({ error: 'Google authentication failed' });
    }
});

module.exports = router;
