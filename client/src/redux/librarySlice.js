import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../services/apiClient';

export const fetchLikedSongs = createAsyncThunk('library/fetchLikedSongs', async (_, thunkAPI) => {
    try {
        const response = await apiClient.get('/library/liked');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const likeSong = createAsyncThunk('library/likeSong', async (song, thunkAPI) => {
    try {
        const response = await apiClient.post(`/library/like/${song.videoId || song.id}`, song);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const unlikeSong = createAsyncThunk('library/unlikeSong', async (videoId, thunkAPI) => {
    try {
        const response = await apiClient.delete(`/library/like/${videoId}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

const initialState = {
    likedSongs: [],
    loading: false,
    error: null
};

export const librarySlice = createSlice({
    name: 'library',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLikedSongs.pending, (state) => { state.loading = true; })
            .addCase(fetchLikedSongs.fulfilled, (state, action) => {
                state.loading = false;
                state.likedSongs = action.payload;
            })
            .addCase(fetchLikedSongs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(likeSong.fulfilled, (state, action) => {
                state.likedSongs = action.payload;
            })
            .addCase(unlikeSong.fulfilled, (state, action) => {
                state.likedSongs = action.payload;
            });
    }
});

export default librarySlice.reducer;
