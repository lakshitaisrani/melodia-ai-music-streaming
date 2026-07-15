import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import musicService from '../services/musicService';

export const fetchSearchResults = createAsyncThunk(
    'search/fetchSearchResults',
    async (params, { rejectWithValue }) => {
        try {
            // params can be a string (legacy) or an object { query, genre }
            let query = '';
            let genre = '';
            
            if (typeof params === 'string') {
                query = params;
            } else if (params) {
                query = params.query || '';
                genre = params.genre || '';
            }

            const data = await musicService.searchSongs(query, genre);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to search music');
        }
    }
);

const initialState = {
    query: '',
    results: [],
    loading: false,
    error: null,
};

export const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        clearSearchResults: (state) => {
            state.results = [];
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearchResults.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearchResults.fulfilled, (state, action) => {
                state.loading = false;
                state.results = action.payload;
            })
            .addCase(fetchSearchResults.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setSearchQuery, clearSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
