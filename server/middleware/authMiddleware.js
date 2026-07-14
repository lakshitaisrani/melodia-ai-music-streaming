const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const mockDb = require('../services/mockDb');

const JWT_SECRET = process.env.JWT_SECRET || 'melodia_secret_key_12345';

const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        let user;
        if (mongoose.connection.readyState === 1) {
            user = await User.findById(decoded.uid);
            if (!user) {
                user = await User.findOne({ firebaseUid: decoded.uid });
            }
        } else {
            // MongoDB disconnected - fallback to mock DB
            user = mockDb.getUser(decoded.uid, decoded);
        }

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying custom JWT token:', error.message);
        return res.status(403).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};

module.exports = authenticateUser;
