const axios = require('axios');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

let accessToken = null;
let tokenExpiresAt = 0;

const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpiresAt) {
        return accessToken;
    }

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
        throw new Error('Spotify credentials are not configured in environment variables.');
    }

    try {
        const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${authHeader}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        accessToken = response.data.access_token;
        // Expire token 60 seconds early to prevent edge cases
        tokenExpiresAt = Date.now() + (response.data.expires_in - 60) * 1000;
        return accessToken;
    } catch (error) {
        console.error('Failed to get Spotify access token:', error?.response?.data || error.message);
        throw error;
    }
};

const formatDuration = (ms) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const spotifyService = {
    isConfigured: () => {
        return !!(SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET);
    },

    searchSongs: async (query) => {
        try {
            const token = await getAccessToken();
            const response = await axios.get('https://api.spotify.com/v1/search', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    q: query,
                    type: 'track',
                    limit: 20,
                },
            });

            const tracks = response.data.tracks?.items || [];
            return tracks.map((track) => ({
                id: track.id,
                title: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                thumbnail: track.album.images[0]?.url || track.album.images[1]?.url || '',
                duration: formatDuration(track.duration_ms),
                videoId: null,
                source: 'spotify',
            }));
        } catch (error) {
            console.error('Error searching Spotify tracks:', error?.response?.data || error.message);
            throw error;
        }
    },
};

module.exports = spotifyService;
