const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
console.log('GEMINI_API_KEY from env:', process.env.GEMINI_API_KEY);

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

app.use(cors());
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

// Serve built React client in production
const clientBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientBuildPath));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/user', userRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Catch-all: serve React app for any non-API route (client-side routing)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server!' });
});

mongoose.connection.on('error', err => {
    console.error('Mongoose connection error event:', err);
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✓ MongoDB Connected'))
    .catch(err => console.error('MongoDB initial connection error:', err));

if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`✓ Server running on port ${PORT}`);
    });
}

module.exports = app;
