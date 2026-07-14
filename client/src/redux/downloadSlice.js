import { createSlice } from '@reduxjs/toolkit';

const getInitialDownloads = () => {
  try {
    const saved = localStorage.getItem('downloaded_songs');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse downloaded songs:', error);
    return [];
  }
};

const downloadSlice = createSlice({
  name: 'downloads',
  initialState: {
    downloadedSongs: getInitialDownloads(),
    downloadingSongs: {} // track videoId -> true/false for progress
  },
  reducers: {
    startDownloading: (state, action) => {
      state.downloadingSongs[action.payload] = true;
    },
    finishDownloading: (state, action) => {
      delete state.downloadingSongs[action.payload.videoId];
      const exists = state.downloadedSongs.some(s => s.videoId === action.payload.videoId);
      if (!exists) {
        state.downloadedSongs.unshift(action.payload);
        localStorage.setItem('downloaded_songs', JSON.stringify(state.downloadedSongs));
      }
    },
    removeDownload: (state, action) => {
      state.downloadedSongs = state.downloadedSongs.filter(s => s.videoId !== action.payload);
      localStorage.setItem('downloaded_songs', JSON.stringify(state.downloadedSongs));
    }
  }
});

export const { startDownloading, finishDownloading, removeDownload } = downloadSlice.actions;
export default downloadSlice.reducer;
