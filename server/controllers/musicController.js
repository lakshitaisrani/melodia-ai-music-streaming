const youtubeService = require('../services/youtubeService');
const spotifyService = require('../services/spotifyService');

const musicController = {
    getTrending: async (req, res) => {
        try {
            const trendingMusic = await youtubeService.getTrendingMusic();
            res.status(200).json(trendingMusic);
        } catch (error) {
            console.error("Error in getTrending controller:", error);
            res.status(500).json({ error: "Failed to fetch trending music" });
        }
    },

    searchMusic: async (req, res) => {
        try {
            const query = req.query.q;
            
            if (!query) {
                return res.status(400).json({ error: "Search query 'q' is required" });
            }

            let searchResults;
            if (spotifyService.isConfigured()) {
                try {
                    searchResults = await spotifyService.searchSongs(query);
                    console.log(`Spotify search successful for "${query}"`);
                } catch (spotifyError) {
                    console.warn("Spotify search failed, falling back to YouTube:", spotifyError.message);
                    searchResults = await youtubeService.searchMusic(query);
                }
            } else {
                searchResults = await youtubeService.searchMusic(query);
            }

            res.status(200).json(searchResults);
        } catch (error) {
            console.error("Error in searchMusic controller:", error);
            res.status(500).json({ error: "Failed to search for music" });
        }
    },

    resolveTrack: async (req, res) => {
        try {
            const { title, artist } = req.query;
            if (!title || !artist) {
                return res.status(400).json({ error: "Parameters 'title' and 'artist' are required" });
            }

            const searchQuery = `${artist} ${title} official audio`;
            const searchResults = await youtubeService.searchMusic(searchQuery);
            if (searchResults && searchResults.length > 0) {
                // Return the first match which contains the videoId
                return res.status(200).json(searchResults[0]);
            }
            res.status(404).json({ error: "No matching video found on YouTube" });
        } catch (error) {
            console.error("Error in resolveTrack controller:", error);
            res.status(500).json({ error: "Failed to resolve track to YouTube video" });
        }
    },

    getVideoDetails: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ error: "Video ID is required" });
            }

            const videoDetails = await youtubeService.getVideoDetails(id);
            
            if (!videoDetails) {
                return res.status(404).json({ error: "Video not found" });
            }

            res.status(200).json(videoDetails);
        } catch (error) {
            console.error("Error in getVideoDetails controller:", error);
            res.status(500).json({ error: "Failed to fetch video details" });
        }
    },

    getNewReleases: async (req, res) => {
        try {
            const newReleases = await youtubeService.getNewReleases();
            res.status(200).json(newReleases);
        } catch (error) {
            console.error("Error in getNewReleases controller:", error);
            res.status(500).json({ error: "Failed to fetch new releases" });
        }
    },

    getRecommended: async (req, res) => {
        try {
            const recommended = await youtubeService.getRecommended();
            res.status(200).json(recommended);
        } catch (error) {
            console.error("Error in getRecommended controller:", error);
            res.status(500).json({ error: "Failed to fetch recommended music" });
        }
    },

    getPopularArtists: async (req, res) => {
        try {
            const popularArtists = await youtubeService.getPopularArtists();
            res.status(200).json(popularArtists);
        } catch (error) {
            console.error("Error in getPopularArtists controller:", error);
            res.status(500).json({ error: "Failed to fetch popular artists" });
        }
    }
};

module.exports = musicController;
