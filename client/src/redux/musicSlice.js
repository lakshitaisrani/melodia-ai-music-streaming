import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import musicService from '../services/musicService';

export const fetchTrendingSongs = createAsyncThunk('music/fetchTrendingSongs', async (_, thunkAPI) => {
    try { return await musicService.getTrending(); }
    catch (error) { return thunkAPI.rejectWithValue((error.response && error.response.data && error.response.data.error) || error.message || error.toString()); }
});

export const fetchNewReleases = createAsyncThunk('music/fetchNewReleases', async (_, thunkAPI) => {
    try { return await musicService.getNewReleases(); }
    catch (error) { return thunkAPI.rejectWithValue((error.response && error.response.data && error.response.data.error) || error.message || error.toString()); }
});

export const fetchRecommended = createAsyncThunk('music/fetchRecommended', async (_, thunkAPI) => {
    try { return await musicService.getRecommended(); }
    catch (error) { return thunkAPI.rejectWithValue((error.response && error.response.data && error.response.data.error) || error.message || error.toString()); }
});

export const fetchPopularArtists = createAsyncThunk('music/fetchPopularArtists', async (_, thunkAPI) => {
    try { return await musicService.getPopularArtists(); }
    catch (error) { return thunkAPI.rejectWithValue((error.response && error.response.data && error.response.data.error) || error.message || error.toString()); }
});

const initialState = {
    trending: [],
    newReleases: [],
    recommended: [],
    popularArtists: [],
    loading: false,
    error: null
};

export const musicSlice = createSlice({
    name: 'music',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // fetchTrendingSongs
            .addCase(fetchTrendingSongs.pending, (state) => { state.loading = true; })
            .addCase(fetchTrendingSongs.fulfilled, (state, action) => { state.loading = false; state.trending = action.payload; })
            .addCase(fetchTrendingSongs.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            // fetchNewReleases
            .addCase(fetchNewReleases.pending, (state) => { state.loading = true; })
            .addCase(fetchNewReleases.fulfilled, (state, action) => { state.loading = false; state.newReleases = action.payload; })
            .addCase(fetchNewReleases.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            // fetchRecommended
            .addCase(fetchRecommended.pending, (state) => { state.loading = true; })
            .addCase(fetchRecommended.fulfilled, (state, action) => { state.loading = false; state.recommended = action.payload; })
            .addCase(fetchRecommended.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
            
            // fetchPopularArtists
            .addCase(fetchPopularArtists.pending, (state) => { state.loading = true; })
            .addCase(fetchPopularArtists.fulfilled, (state, action) => { state.loading = false; state.popularArtists = action.payload; })
            .addCase(fetchPopularArtists.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    }
});

export default musicSlice.reducer;
