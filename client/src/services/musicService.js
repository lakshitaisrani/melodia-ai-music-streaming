import apiClient from './apiClient';

const getTrending = async () => {
    const response = await apiClient.get('/music/trending');
    return response.data;
};

const searchSongs = async (query, genre) => {
    const params = {};
    if (query) params.q = query;
    if (genre) params.genre = genre.toLowerCase();
    
    const response = await apiClient.get('/music/search', { params });
    return response.data;
};

const getVideoDetails = async (id) => {
    const response = await apiClient.get(`/music/video/${id}`);
    return response.data;
};

const getNewReleases = async () => {
    const response = await apiClient.get('/music/new-releases');
    return response.data;
};

const getRecommended = async () => {
    const response = await apiClient.get('/music/recommended');
    return response.data;
};

const getPopularArtists = async () => {
    const response = await apiClient.get('/music/popular-artists');
    return response.data;
};

const musicService = {
    getTrending,
    searchSongs,
    getVideoDetails,
    getNewReleases,
    getRecommended,
    getPopularArtists
};

export default musicService;
