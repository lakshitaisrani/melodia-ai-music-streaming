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

const allowedOrigins = ['https://melodia-ai-music-streaming-client.vercel.app', 'http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.options('/{*path}', cors());
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

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('FATAL ERROR: MONGO_URI is not defined in environment variables.');
    process.exit(1);
}

const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4, // Use IPv4, skip trying IPv6
    maxPoolSize: 50,
    tls: true,
    tlsAllowInvalidCertificates: true, // Diagnostic only
    tlsInsecure: true // Diagnostic only
};

const connectWithRetry = () => {
    console.log('Attempting MongoDB connection...');
    mongoose.connect(mongoUri, mongooseOptions)
        .then(() => {
            console.log('✓ MongoDB Connected');
            console.log('MongoDB connected to database:', mongoose.connection.name);
        })
        .catch(err => {
            console.error('MongoDB connection failed. Retrying in 5 seconds...', err.message);
            setTimeout(connectWithRetry, 5000);
        });
};

connectWithRetry();

if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✓ Server running on port ${PORT}`);
    });
}

module.exports = app;
