import { configureStore } from '@reduxjs/toolkit';
import musicReducer from './musicSlice';
import playerReducer from './playerSlice';
import searchReducer from './searchSlice';
import authReducer from './authSlice';
import libraryReducer from './librarySlice';
import playlistReducer from './playlistSlice';
import downloadReducer from './downloadSlice';

export const store = configureStore({
  reducer: {
    music: musicReducer,
    player: playerReducer,
    search: searchReducer,
    auth: authReducer,
    library: libraryReducer,
    playlist: playlistReducer,
    downloads: downloadReducer
  },
});
