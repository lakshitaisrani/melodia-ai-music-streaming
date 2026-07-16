const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    default: ''
  },
  privacy: {
    type: String,
    enum: ['Public', 'Private'],
    default: 'Public'
  },
  tags: {
    type: [String],
    default: []
  },
  playlistType: {
    type: String,
    enum: ['manual', 'ai', 'smart_ai', 'discover_weekly'],
    default: 'manual'
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  generatedBy: {
    type: String,
    default: ''
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  saveCount: {
    type: Number,
    default: 0
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  playCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  songs: [{
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: false }
  }]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;
