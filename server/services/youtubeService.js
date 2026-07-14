const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

// Simple in-memory cache for search results
const searchCache = new Map();

// Utility to normalize the YouTube API response
const normalizeVideoItem = (item) => {
    let duration = null;
    
    if (item.contentDetails && item.contentDetails.duration) {
        duration = parseISO8601Duration(item.contentDetails.duration);
    }

    return {
        id: item.id.videoId || item.id,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url,
        duration: duration,
        videoId: item.id.videoId || item.id
    };
};

// Parse ISO 8601 duration (e.g., PT1H2M10S) to mm:ss or hh:mm:ss
const parseISO8601Duration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (parseInt(match[1]) || 0);
    const minutes = (parseInt(match[2]) || 0);
    const seconds = (parseInt(match[3]) || 0);

    let formattedDuration = '';
    
    if (hours > 0) {
        formattedDuration += `${hours}:`;
        formattedDuration += `${minutes.toString().padStart(2, '0')}:`;
    } else {
        formattedDuration += `${minutes}:`;
    }
    
    formattedDuration += `${seconds.toString().padStart(2, '0')}`;

    return formattedDuration;
};

// Create an Axios instance
const youtubeClient = axios.create({
    baseURL: YOUTUBE_API_URL,
    params: {
        key: YOUTUBE_API_KEY
    }
});

const youtubeService = {
    getTrendingMusic: async () => {
        try {
            const response = await youtubeClient.get('/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    chart: 'mostPopular',
                    videoCategoryId: '10', // 10 is the category ID for Music
                    regionCode: 'US',
                    maxResults: 20
                }
            });
            
            return response.data.items.map(normalizeVideoItem);
        } catch (error) {
            console.error('Error fetching trending music from YouTube:', error?.response?.data || error.message);
            throw error;
        }
    },

    searchMusic: async (query) => {
        if (searchCache.has(query)) {
            return searchCache.get(query);
        }
        
        try {
            // First, search for videos
            const searchResponse = await youtubeClient.get('/search', {
                params: {
                    part: 'snippet',
                    type: 'video',
                    videoCategoryId: '10', // Music
                    q: query,
                    maxResults: 20
                }
            });

            const searchItems = searchResponse.data.items;
            
            if (searchItems.length === 0) return [];

            // Extract video IDs to fetch durations
            const videoIds = searchItems.map(item => item.id.videoId).join(',');
            
            // Fetch contentDetails for the video durations
            const videosResponse = await youtubeClient.get('/videos', {
                params: {
                    part: 'snippet,contentDetails',
                    id: videoIds
                }
            });

            const results = videosResponse.data.items.map(normalizeVideoItem);
            searchCache.set(query, results);
            
            // Keep cache size manageable
            if (searchCache.size > 100) {
                const firstKey = searchCache.keys().next().value;
                searchCache.delete(firstKey);
            }
            
            return results;
        } catch (error) {
            console.error('Error searching music on YouTube:', error?.response?.data || error.message);
            
            // Fallback for quota limits (403/429)
            if (error?.response?.status === 403 || error?.response?.status === 429) {
                console.warn("YouTube API Quota exceeded for search. Returning trending music as fallback to prevent UI crash.");
                return await youtubeService.getTrendingMusic();
            }
            
            throw error;
        }
    },

    getVideoDetails: async (videoId) => {
        try {
            const response = await youtubeClient.get('/videos', {
                params: {
                    part: 'snippet,contentDetails,statistics',
                    id: videoId
                }
            });

            if (response.data.items.length === 0) {
                return null;
            }

            return normalizeVideoItem(response.data.items[0]);
        } catch (error) {
            console.error('Error fetching video details from YouTube:', error?.response?.data || error.message);
            throw error;
        }
    },

    getNewReleases: async () => {
        try {
            const response = await youtubeClient.get('/search', {
                params: {
                    part: 'snippet',
                    type: 'video',
                    videoCategoryId: '10',
                    q: 'latest music releases official',
                    maxResults: 15
                }
            });
            const searchItems = response.data.items;
            if (searchItems.length === 0) return [];
            
            const videoIds = searchItems.map(item => item.id.videoId).join(',');
            const videosResponse = await youtubeClient.get('/videos', {
                params: { part: 'snippet,contentDetails', id: videoIds }
            });
            return videosResponse.data.items.map(normalizeVideoItem);
        } catch (error) {
            console.error('Error fetching new releases from YouTube:', error?.response?.data || error.message);
            throw error;
        }
    },

    getRecommended: async () => {
        try {
            const response = await youtubeClient.get('/search', {
                params: {
                    part: 'snippet',
                    type: 'video',
                    videoCategoryId: '10',
                    q: 'top music hits recommended',
                    maxResults: 10
                }
            });
            const searchItems = response.data.items;
            if (searchItems.length === 0) return [];
            
            const videoIds = searchItems.map(item => item.id.videoId).join(',');
            const videosResponse = await youtubeClient.get('/videos', {
                params: { part: 'snippet,contentDetails', id: videoIds }
            });
            return videosResponse.data.items.map(normalizeVideoItem);
        } catch (error) {
            console.error('Error fetching recommended from YouTube:', error?.response?.data || error.message);
            throw error;
        }
    },

    getPopularArtists: async () => {
        try {
            const response = await youtubeClient.get('/search', {
                params: {
                    part: 'snippet',
                    type: 'channel',
                    q: 'vevo official artist channel',
                    maxResults: 10
                }
            });
            
            return response.data.items.map(item => ({
                id: item.id.channelId,
                title: item.snippet.channelTitle,
                description: item.snippet.description || 'Popular Artist',
                image: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
            }));
        } catch (error) {
            console.error('Error fetching popular artists from YouTube:', error?.response?.data || error.message);
            throw error;
        }
    }
};

module.exports = youtubeService;
