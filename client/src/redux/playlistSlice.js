import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

const updatePlaylistInState = (state, id, updateFn) => {
    if (state.currentPlaylist && state.currentPlaylist._id === id) {
        updateFn(state.currentPlaylist);
    }
    state.playlists = state.playlists.map(p => {
        if (p._id === id) {
            const newP = { ...p };
            updateFn(newP);
            return newP;
        }
        return p;
    });
    state.likedPlaylists = state.likedPlaylists.map(p => {
        if (p._id === id) {
            const newP = { ...p };
            updateFn(newP);
            return newP;
        }
        return p;
    });
    state.savedPlaylists = state.savedPlaylists.map(p => {
        if (p._id === id) {
            const newP = { ...p };
            updateFn(newP);
            return newP;
        }
        return p;
    });
};

export const fetchLikedPlaylists = createAsyncThunk('playlist/fetchLikedPlaylists', async (_, thunkAPI) => {
    try {
        const response = await apiClient.get('/playlists/liked');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const togglePlaylistLike = createAsyncThunk('playlist/togglePlaylistLike', async ({ id, userId, isLiked }, thunkAPI) => {
    try {
        const response = await apiClient.post(`/playlists/${id}/like`);
        return { id, isLiked: response.data.isLiked, stats: response.data.stats, likedBy: response.data.likedBy || [] };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const togglePlaylistSave = createAsyncThunk('playlist/togglePlaylistSave', async ({ id, userId, isSaved }, thunkAPI) => {
    try {
        const response = await apiClient.post(`/playlists/${id}/save`);
        return { id, isSaved: response.data.isSaved, stats: response.data.stats, savedBy: response.data.savedBy || [] };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchMyPlaylists = createAsyncThunk('playlist/fetchMyPlaylists', async (_, thunkAPI) => {
    try {
        const response = await apiClient.get('/playlists/my');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const incrementShareCount = createAsyncThunk('playlist/incrementShareCount', async (id, thunkAPI) => {
    try {
        const response = await apiClient.post(`/playlists/${id}/share`);
        return { id, stats: response.data.stats };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const incrementPlayCount = createAsyncThunk('playlist/incrementPlayCount', async (id, thunkAPI) => {
    try {
        const response = await apiClient.post(`/playlists/${id}/play`);
        return { id, stats: response.data.stats };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const generateDiscoverWeekly = createAsyncThunk('playlist/generateDiscoverWeekly', async (_, thunkAPI) => {
    try {
        const response = await apiClient.post('/ai/discover-weekly');
        thunkAPI.dispatch(fetchMyPlaylists());
        return response.data.playlist;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const fetchPlaylistDetails = createAsyncThunk('playlist/fetchPlaylistDetails', async (id, thunkAPI) => {
    try {
        const response = await apiClient.get(`/playlists/${id}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const createPlaylist = createAsyncThunk('playlist/createPlaylist', async (playlistData, thunkAPI) => {
    try {
        const response = await apiClient.post('/playlists', playlistData);
        thunkAPI.dispatch(fetchMyPlaylists());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const generateSmartPlaylist = createAsyncThunk('playlist/generateSmartPlaylist', async (data, thunkAPI) => {
    try {
        const response = await apiClient.post('/ai/generate-playlist', data);
        thunkAPI.dispatch(fetchMyPlaylists());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updatePlaylist = createAsyncThunk('playlist/updatePlaylist', async ({ id, data }, thunkAPI) => {
    try {
        const response = await apiClient.put(`/playlists/${id}`, data);
        thunkAPI.dispatch(fetchMyPlaylists());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const deletePlaylist = createAsyncThunk('playlist/deletePlaylist', async (id, thunkAPI) => {
    try {
        await apiClient.delete(`/playlists/${id}`);
        thunkAPI.dispatch(fetchMyPlaylists());
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const addSongToPlaylist = createAsyncThunk('playlist/addSong', async ({ id, song }, thunkAPI) => {
    try {
        const response = await apiClient.post(`/playlists/${id}/songs`, song);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const removeSongFromPlaylist = createAsyncThunk('playlist/removeSong', async ({ id, videoId }, thunkAPI) => {
    try {
        const response = await apiClient.delete(`/playlists/${id}/songs/${videoId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

const initialState = {
    playlists: [],
    likedPlaylists: [],
    savedPlaylists: [],
    currentPlaylist: null,
    loading: false,
    currentLoading: false,
    error: null
};

export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        clearCurrentPlaylist: (state) => {
            state.currentPlaylist = null;
        },
        playPlaylist: (state, action) => {
            // Action handled by playerSlice/hook
        },
        shufflePlaylist: (state, action) => {
            // Action handled by playerSlice/hook
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Liked Playlists
            .addCase(fetchLikedPlaylists.pending, (state) => { state.loading = true; })
            .addCase(fetchLikedPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.likedPlaylists = action.payload;
            })
            .addCase(fetchLikedPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Toggle Playlist Like (Optimistic & Rollback)
            .addCase(togglePlaylistLike.pending, (state, action) => {
                const { id, userId, isLiked } = action.meta.arg;
                updatePlaylistInState(state, id, (playlist) => {
                    if (!playlist.likedBy) playlist.likedBy = [];
                    if (isLiked) {
                        playlist.likedBy = playlist.likedBy.filter(uid => uid.toString() !== userId.toString());
                        playlist.likes = Math.max(0, (playlist.likes || 1) - 1);
                    } else {
                        if (!playlist.likedBy.includes(userId)) {
                            playlist.likedBy.push(userId);
                        }
                        playlist.likes = (playlist.likes || 0) + 1;
                    }
                });
            })
            .addCase(togglePlaylistLike.rejected, (state, action) => {
                const { id, userId, isLiked } = action.meta.arg;
                updatePlaylistInState(state, id, (playlist) => {
                    if (!playlist.likedBy) playlist.likedBy = [];
                    if (isLiked) {
                        if (!playlist.likedBy.includes(userId)) {
                            playlist.likedBy.push(userId);
                        }
                        playlist.likes = (playlist.likes || 0) + 1;
                    } else {
                        playlist.likedBy = playlist.likedBy.filter(uid => uid.toString() !== userId.toString());
                        playlist.likes = Math.max(0, (playlist.likes || 1) - 1);
                    }
                });
            })
            .addCase(togglePlaylistLike.fulfilled, (state, action) => {
                const { id, isLiked, stats, likedBy } = action.payload;
                updatePlaylistInState(state, id, (playlist) => {
                    playlist.likes = stats.likes;
                    playlist.saveCount = stats.saves;
                    playlist.playCount = stats.plays;
                    playlist.shareCount = stats.shares;
                    playlist.likedBy = likedBy || playlist.likedBy;
                });
                
                // Keep likedPlaylists array in sync
                if (isLiked) {
                    const exists = state.likedPlaylists.some(p => p._id === id);
                    if (!exists && state.currentPlaylist && state.currentPlaylist._id === id) {
                        state.likedPlaylists.push(state.currentPlaylist);
                    }
                } else {
                    state.likedPlaylists = state.likedPlaylists.filter(p => p._id !== id);
                }
            })

            // Toggle Playlist Save (Optimistic & Rollback)
            .addCase(togglePlaylistSave.pending, (state, action) => {
                const { id, userId, isSaved } = action.meta.arg;
                updatePlaylistInState(state, id, (playlist) => {
                    if (!playlist.savedBy) playlist.savedBy = [];
                    if (isSaved) {
                        playlist.savedBy = playlist.savedBy.filter(uid => uid.toString() !== userId.toString());
                        playlist.saveCount = Math.max(0, (playlist.saveCount || 1) - 1);
                    } else {
                        if (!playlist.savedBy.includes(userId)) {
                            playlist.savedBy.push(userId);
                        }
                        playlist.saveCount = (playlist.saveCount || 0) + 1;
                    }
                });
            })
            .addCase(togglePlaylistSave.rejected, (state, action) => {
                const { id, userId, isSaved } = action.meta.arg;
                updatePlaylistInState(state, id, (playlist) => {
                    if (!playlist.savedBy) playlist.savedBy = [];
                    if (isSaved) {
                        if (!playlist.savedBy.includes(userId)) {
                            playlist.savedBy.push(userId);
                        }
                        playlist.saveCount = (playlist.saveCount || 0) + 1;
                    } else {
                        playlist.savedBy = playlist.savedBy.filter(uid => uid.toString() !== userId.toString());
                        playlist.saveCount = Math.max(0, (playlist.saveCount || 1) - 1);
                    }
                });
            })
            .addCase(togglePlaylistSave.fulfilled, (state, action) => {
                const { id, isSaved, stats, savedBy } = action.payload;
                updatePlaylistInState(state, id, (playlist) => {
                    playlist.likes = stats.likes;
                    playlist.saveCount = stats.saves;
                    playlist.playCount = stats.plays;
                    playlist.shareCount = stats.shares;
                    playlist.savedBy = savedBy || playlist.savedBy;
                });
                
                if (isSaved) {
                    const exists = state.savedPlaylists.some(p => p._id === id);
                    if (!exists && state.currentPlaylist && state.currentPlaylist._id === id) {
                        state.savedPlaylists.push(state.currentPlaylist);
                    }
                } else {
                    state.savedPlaylists = state.savedPlaylists.filter(p => p._id !== id);
                }
            })

            // Increment Share
            .addCase(incrementShareCount.fulfilled, (state, action) => {
                const { id, stats } = action.payload;
                if (state.currentPlaylist && state.currentPlaylist._id === id) {
                    state.currentPlaylist.shareCount = stats.shares;
                }
            })

            // Increment Play
            .addCase(incrementPlayCount.fulfilled, (state, action) => {
                const { id, stats } = action.payload;
                if (state.currentPlaylist && state.currentPlaylist._id === id) {
                    state.currentPlaylist.playCount = stats.plays;
                }
            })
            
            // Fetch multiple
            .addCase(fetchMyPlaylists.pending, (state) => { state.loading = true; })
            .addCase(fetchMyPlaylists.fulfilled, (state, action) => {
                state.loading = false;
                state.playlists = action.payload;
            })
            .addCase(fetchMyPlaylists.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Fetch single
            .addCase(fetchPlaylistDetails.pending, (state) => { state.currentLoading = true; })
            .addCase(fetchPlaylistDetails.fulfilled, (state, action) => {
                state.currentLoading = false;
                state.currentPlaylist = action.payload;
            })
            .addCase(fetchPlaylistDetails.rejected, (state, action) => {
                state.currentLoading = false;
                state.error = action.payload;
            })
            
            // Create
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.playlists.unshift(action.payload);
            })
            
            // Generate Smart Playlist
            .addCase(generateSmartPlaylist.fulfilled, (state, action) => {
                state.playlists.unshift(action.payload);
            })

            // Generate Discover Weekly
            .addCase(generateDiscoverWeekly.fulfilled, (state, action) => {
                const index = state.playlists.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.playlists[index] = action.payload;
                } else {
                    state.playlists.unshift(action.payload);
                }
            })
            
            // Update
            .addCase(updatePlaylist.fulfilled, (state, action) => {
                const index = state.playlists.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.playlists[index] = action.payload;
                }
                const likedIndex = state.likedPlaylists.findIndex(p => p._id === action.payload._id);
                if (likedIndex !== -1) {
                    state.likedPlaylists[likedIndex] = action.payload;
                }
                const savedIndex = state.savedPlaylists.findIndex(p => p._id === action.payload._id);
                if (savedIndex !== -1) {
                    state.savedPlaylists[savedIndex] = action.payload;
                }
                if (state.currentPlaylist && state.currentPlaylist._id === action.payload._id) {
                    state.currentPlaylist = { ...state.currentPlaylist, ...action.payload };
                }
            })
            
            // Delete
            .addCase(deletePlaylist.fulfilled, (state, action) => {
                state.playlists = state.playlists.filter(p => p._id !== action.payload);
                state.likedPlaylists = state.likedPlaylists.filter(p => p._id !== action.payload);
                state.savedPlaylists = state.savedPlaylists.filter(p => p._id !== action.payload);
                if (state.currentPlaylist && state.currentPlaylist._id === action.payload) {
                    state.currentPlaylist = null;
                }
            })
            
            // Add/Remove songs update the current playlist and the list if needed
            .addCase(addSongToPlaylist.fulfilled, (state, action) => {
                state.currentPlaylist = action.payload;
                const index = state.playlists.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.playlists[index] = action.payload;
                }
            })
            .addCase(removeSongFromPlaylist.fulfilled, (state, action) => {
                state.currentPlaylist = action.payload;
                const index = state.playlists.findIndex(p => p._id === action.payload._id);
                if (index !== -1) {
                    state.playlists[index] = action.payload;
                }
            });
    }
});

export const { clearCurrentPlaylist, playPlaylist, shufflePlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
