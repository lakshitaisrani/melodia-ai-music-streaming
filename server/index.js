const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const musicRoutes = require('./routes/musicRoutes');
const userRoutes = require('./routes/userRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const aiRoutes = require('./routes/aiRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

const frontendUrl = process.env.FRONTEND_URL;
const cleanFrontendUrl = frontendUrl ? frontendUrl.replace(/\/$/, '') : null;
const allowedOrigins = cleanFrontendUrl ? [cleanFrontendUrl, 'http://localhost:5173'] : ['http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));

// The YOUTUBE_API_KEY is loaded from the .env file.
// We read it using process.env to avoid hardcoding or exposing the key.
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
    console.warn("Warning: YOUTUBE_API_KEY is not defined in the .env file");
}

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

mongoose.connection.on('error', err => {
    console.error('Mongoose connection error event:', err);
});

mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(() => console.log('✓ MongoDB Connected'))
    .catch(err => console.error('MongoDB initial connection error:', err));

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
    });
}

module.exports = app;
