const express = require('express');
const authenticateUser = require('../middleware/authMiddleware');
const mongoose = require('mongoose');
const Playlist = require('../models/Playlist');
const mockDb = require('../services/mockDb');
const router = express.Router();

// Middleware to verify playlist ownership
const verifyOwner = async (req, res, next) => {
    try {
        let playlist;
        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(req.params.id);
        } else {
            playlist = mockDb.getPlaylistById(req.params.id);
        }
        
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        
        if (playlist.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to modify this playlist' });
        }
        
        req.playlist = playlist;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error finding playlist' });
    }
};

// POST /api/playlists - Create new playlist
router.post('/', authenticateUser, async (req, res) => {
    try {
        const { title, description, coverImage, genre, privacy, tags, songs } = req.body;
        
        let newPlaylist;
        if (mongoose.connection.readyState === 1) {
            newPlaylist = new Playlist({
                owner: req.user._id,
                title,
                description: description || '',
                coverImage: coverImage || '',
                genre: genre || '',
                privacy: privacy || 'Public',
                tags: tags || [],
                songs: songs || []
            });
            await newPlaylist.save();
        } else {
            newPlaylist = mockDb.createPlaylist(req.user._id, {
                title,
                description,
                coverImage,
                genre,
                privacy,
                tags,
                songs
            });
        }
        res.status(201).json(newPlaylist);
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ error: 'Failed to create playlist' });
    }
});

// GET /api/playlists/my - Get user's playlists
router.get('/my', authenticateUser, async (req, res) => {
    try {
        let playlists;
        if (mongoose.connection.readyState === 1) {
            playlists = await Playlist.find({ owner: req.user._id }).sort({ createdAt: -1 });
        } else {
            playlists = mockDb.getPlaylists(req.user._id).sort((a, b) => b.createdAt - a.createdAt);
        }
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
});

// GET /api/playlists/liked - Get liked playlists
router.get('/liked', authenticateUser, async (req, res) => {
    try {
        let likedPlaylists = [];
        if (mongoose.connection.readyState === 1) {
            const User = require('../models/User');
            const user = await User.findById(req.user._id).populate({
                path: 'likedPlaylists',
                populate: { path: 'owner', select: 'name photoURL' }
            });
            likedPlaylists = user.likedPlaylists || [];
        } else {
            const user = mockDb.getUser(req.user.firebaseUid || req.user._id);
            const userLikedIds = user.likedPlaylists || [];
            likedPlaylists = userLikedIds.map(id => mockDb.getPlaylistById(id)).filter(Boolean);
        }
        res.status(200).json(likedPlaylists);
    } catch (error) {
        console.error('Error fetching liked playlists:', error);
        res.status(500).json({ error: 'Failed to fetch liked playlists' });
    }
});



// GET /api/playlists/:id - Get specific playlist
router.get('/:id', authenticateUser, async (req, res) => {
    try {
        let playlist;
        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(req.params.id).populate('owner', 'name photoURL');
        } else {
            playlist = mockDb.getPlaylistById(req.params.id);
            if (playlist) {
                // Populate owner object directly
                playlist.owner = { 
                    _id: req.user._id, 
                    name: req.user.name, 
                    photoURL: req.user.photoURL 
                };
            }
        }
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        
        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
});

// PUT /api/playlists/:id - Update playlist metadata
router.put('/:id', authenticateUser, verifyOwner, async (req, res) => {
    try {
        const { title, description, coverImage, genre, privacy, tags } = req.body;
        
        if (title) req.playlist.title = title;
        if (description !== undefined) req.playlist.description = description;
        if (coverImage !== undefined) req.playlist.coverImage = coverImage;
        if (genre !== undefined) req.playlist.genre = genre;
        if (privacy !== undefined) req.playlist.privacy = privacy;
        if (tags !== undefined) req.playlist.tags = tags;
        
        await req.playlist.save();
        res.status(200).json(req.playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update playlist' });
    }
});

// DELETE /api/playlists/:id - Delete playlist
router.delete('/:id', authenticateUser, verifyOwner, async (req, res) => {
    try {
        await req.playlist.deleteOne();
        res.status(200).json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete playlist' });
    }
});

// POST /api/playlists/:id/songs - Add song to playlist
router.post('/:id/songs', authenticateUser, verifyOwner, async (req, res) => {
    try {
        const { videoId, title, artist, thumbnail, duration } = req.body;
        
        const exists = req.playlist.songs.some(song => song.videoId === videoId);
        if (exists) {
            return res.status(400).json({ error: 'Song already exists in playlist' });
        }
        
        req.playlist.songs.push({ videoId, title, artist, thumbnail, duration });
        await req.playlist.save();
        
        res.status(200).json(req.playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add song to playlist' });
    }
});

// DELETE /api/playlists/:id/songs/:videoId - Remove song from playlist
router.delete('/:id/songs/:videoId', authenticateUser, verifyOwner, async (req, res) => {
    try {
        req.playlist.songs = req.playlist.songs.filter(song => song.videoId !== req.params.videoId);
        await req.playlist.save();
        
        res.status(200).json(req.playlist);
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove song from playlist' });
    }
});

// POST /api/playlists/:id/like - Toggle like on a playlist
router.post('/:id/like', authenticateUser, async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user._id;
        let playlist;
        let user;
        let isLiked = false;

        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

            const User = require('../models/User');
            user = await User.findById(userId);

            if (!playlist.likedBy) playlist.likedBy = [];
            if (!user.likedPlaylists) user.likedPlaylists = [];

            const userLikedIndex = playlist.likedBy.indexOf(userId);
            if (userLikedIndex > -1) {
                // Unlike
                playlist.likedBy.splice(userLikedIndex, 1);
                playlist.likes = playlist.likedBy.length;
                user.likedPlaylists = user.likedPlaylists.filter(id => id.toString() !== playlistId);
                isLiked = false;
            } else {
                // Like
                playlist.likedBy.push(userId);
                playlist.likes = playlist.likedBy.length;
                user.likedPlaylists.push(playlistId);
                isLiked = true;
            }

            await playlist.save();
            await user.save();
        } else {
            playlist = mockDb.getPlaylistById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

            user = mockDb.getUser(req.user.firebaseUid || req.user._id);

            if (!playlist.likedBy) playlist.likedBy = [];
            if (!user.likedPlaylists) user.likedPlaylists = [];

            const userLikedIndex = playlist.likedBy.indexOf(userId.toString());
            if (userLikedIndex > -1) {
                playlist.likedBy.splice(userLikedIndex, 1);
                playlist.likes = playlist.likedBy.length;
                user.likedPlaylists = user.likedPlaylists.filter(id => id !== playlistId);
                isLiked = false;
            } else {
                playlist.likedBy.push(userId.toString());
                playlist.likes = playlist.likedBy.length;
                user.likedPlaylists.push(playlistId);
                isLiked = true;
            }
            await playlist.save();
            await user.save();
        }

        res.status(200).json({ 
            success: true, 
            isLiked,
            likedBy: playlist.likedBy || [],
            stats: {
                likes: playlist.likes || 0,
                saves: playlist.saveCount || 0,
                plays: playlist.playCount || 0,
                shares: playlist.shareCount || 0
            }
        });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// POST /api/playlists/:id/save - Toggle save on a playlist
router.post('/:id/save', authenticateUser, async (req, res) => {
    try {
        const playlistId = req.params.id;
        const userId = req.user._id;
        let playlist;
        let user;
        let isSaved = false;

        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

            const User = require('../models/User');
            user = await User.findById(userId);

            if (!playlist.savedBy) playlist.savedBy = [];
            if (!user.savedPlaylists) user.savedPlaylists = [];

            const userSavedIndex = playlist.savedBy.indexOf(userId);
            if (userSavedIndex > -1) {
                // Unsave
                playlist.savedBy.splice(userSavedIndex, 1);
                playlist.saveCount = playlist.savedBy.length;
                user.savedPlaylists = user.savedPlaylists.filter(id => id.toString() !== playlistId);
                isSaved = false;
            } else {
                // Save
                playlist.savedBy.push(userId);
                playlist.saveCount = playlist.savedBy.length;
                user.savedPlaylists.push(playlistId);
                isSaved = true;
            }

            await playlist.save();
            await user.save();
        } else {
            playlist = mockDb.getPlaylistById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

            user = mockDb.getUser(req.user.firebaseUid || req.user._id);

            if (!playlist.savedBy) playlist.savedBy = [];
            if (!user.savedPlaylists) user.savedPlaylists = [];

            const userSavedIndex = playlist.savedBy.indexOf(userId.toString());
            if (userSavedIndex > -1) {
                playlist.savedBy.splice(userSavedIndex, 1);
                playlist.saveCount = playlist.savedBy.length;
                user.savedPlaylists = user.savedPlaylists.filter(id => id !== playlistId);
                isSaved = false;
            } else {
                playlist.savedBy.push(userId.toString());
                playlist.saveCount = playlist.savedBy.length;
                user.savedPlaylists.push(playlistId);
                isSaved = true;
            }
            await playlist.save();
            await user.save();
        }

        res.status(200).json({ 
            success: true, 
            isSaved,
            savedBy: playlist.savedBy || [],
            stats: {
                likes: playlist.likes || 0,
                saves: playlist.saveCount || 0,
                plays: playlist.playCount || 0,
                shares: playlist.shareCount || 0
            }
        });
    } catch (error) {
        console.error('Error toggling save:', error);
        res.status(500).json({ error: 'Failed to toggle save' });
    }
});

// POST /api/playlists/:id/share - Increment share count
router.post('/:id/share', authenticateUser, async (req, res) => {
    try {
        const playlistId = req.params.id;
        let playlist;

        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
            playlist.shareCount = (playlist.shareCount || 0) + 1;
            await playlist.save();
        } else {
            playlist = mockDb.getPlaylistById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
            playlist.shareCount = (playlist.shareCount || 0) + 1;
            await playlist.save();
        }

        res.status(200).json({ 
            success: true, 
            stats: {
                likes: playlist.likes || 0,
                saves: playlist.saveCount || 0,
                plays: playlist.playCount || 0,
                shares: playlist.shareCount || 0
            }
        });
    } catch (error) {
        console.error('Error incrementing share count:', error);
        res.status(500).json({ error: 'Failed to increment share count' });
    }
});

// POST /api/playlists/:id/play - Increment play count
router.post('/:id/play', authenticateUser, async (req, res) => {
    try {
        const playlistId = req.params.id;
        let playlist;

        if (mongoose.connection.readyState === 1) {
            playlist = await Playlist.findById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
            playlist.playCount = (playlist.playCount || 0) + 1;
            await playlist.save();
        } else {
            playlist = mockDb.getPlaylistById(playlistId);
            if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
            playlist.playCount = (playlist.playCount || 0) + 1;
            await playlist.save();
        }

        res.status(200).json({ 
            success: true, 
            stats: {
                likes: playlist.likes || 0,
                saves: playlist.saveCount || 0,
                plays: playlist.playCount || 0,
                shares: playlist.shareCount || 0
            }
        });
    } catch (error) {
        console.error('Error incrementing play count:', error);
        res.status(500).json({ error: 'Failed to increment play count' });
    }
});


// POST /api/playlists/upload - Upload playlist cover image
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post('/upload', authenticateUser, async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: 'Image data is required' });
        }

        // Validate size (5MB max)
        // A base64 string is 4/3 the size of the original data, so 5MB is roughly 6.6MB length
        if (image.length > 7 * 1024 * 1024) {
            return res.status(400).json({ error: 'Image size exceeds the 5MB limit.' });
        }

        console.log(`[Upload] Starting Cloudinary upload...`);
        const uploadResult = await cloudinary.uploader.upload(image, {
            folder: 'melodia_playlists',
            resource_type: 'image'
        });

        console.log(`[Upload Success] Saved to Cloudinary: ${uploadResult.secure_url}`);
        res.status(200).json({ url: uploadResult.secure_url });
    } catch (error) {
        console.error('================ CLOUDINARY UPLOAD ERROR ================');
        console.error('Error:', error.message || error);
        if (error.http_code) console.error('HTTP Code:', error.http_code);
        console.error('=========================================================');
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

module.exports = router;
