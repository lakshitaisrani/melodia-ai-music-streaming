import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 100,
    currentTime: 0,
    duration: 0,
    repeat: 'none', // 'none' | 'all' | 'one'
    shuffle: false
};

const getTrackId = (track) => {
    if (!track) return null;
    return track.id || track.videoId;
};

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setCurrentTrack: (state, action) => {
            state.currentTrack = action.payload;
            state.isPlaying = true;
        },
        playContext: (state, action) => {
            // payload: { track: {}, list: [] }
            state.currentTrack = action.payload.track;
            state.queue = action.payload.list;
            state.isPlaying = true;
        },
        setQueue: (state, action) => {
            state.queue = action.payload;
        },
        playNext: (state, action) => {
            const trackId = getTrackId(action.payload);
            state.queue = state.queue.filter(t => getTrackId(t) !== trackId);
            
            if (!state.currentTrack) {
                state.currentTrack = action.payload;
                state.isPlaying = true;
                return;
            }
            
            const currentId = getTrackId(state.currentTrack);
            const currentIndex = state.queue.findIndex(t => getTrackId(t) === currentId);
            if (currentIndex !== -1) {
                state.queue.splice(currentIndex + 1, 0, action.payload);
            } else {
                state.queue.unshift(action.payload);
            }
        },
        addToQueue: (state, action) => {
            const trackId = getTrackId(action.payload);
            const exists = state.queue.some(t => getTrackId(t) === trackId);
            if (!exists) {
                state.queue.push(action.payload);
            }
        },
        removeFromQueue: (state, action) => {
            const trackId = action.payload;
            state.queue = state.queue.filter(t => getTrackId(t) !== trackId);
        },
        moveQueueTrack: (state, action) => {
            const { index, direction } = action.payload;
            const newIndex = direction === 'up' ? index - 1 : index + 1;
            if (newIndex >= 0 && newIndex < state.queue.length) {
                const temp = state.queue[index];
                state.queue[index] = state.queue[newIndex];
                state.queue[newIndex] = temp;
            }
        },
        setIsPlaying: (state, action) => {
            state.isPlaying = action.payload;
        },
        setVolume: (state, action) => {
            state.volume = action.payload;
        },
        setCurrentTime: (state, action) => {
            state.currentTime = action.payload;
        },
        setDuration: (state, action) => {
            state.duration = action.payload;
        },
        toggleRepeat: (state) => {
            if (state.repeat === 'none') state.repeat = 'all';
            else if (state.repeat === 'all') state.repeat = 'one';
            else state.repeat = 'none';
        },
        toggleShuffle: (state) => {
            state.shuffle = !state.shuffle;
        },
        nextTrack: (state) => {
            if (!state.currentTrack || state.queue.length === 0) return;
            
            if (state.repeat === 'one') {
                state.currentTime = 0;
                return;
            }

            if (state.shuffle) {
                const randomIndex = Math.floor(Math.random() * state.queue.length);
                state.currentTrack = state.queue[randomIndex];
            } else {
                const currentId = getTrackId(state.currentTrack);
                const currentIndex = state.queue.findIndex(t => getTrackId(t) === currentId);
                
                if (currentIndex !== -1 && currentIndex < state.queue.length - 1) {
                    state.currentTrack = state.queue[currentIndex + 1];
                } else if (state.repeat === 'all') {
                    state.currentTrack = state.queue[0];
                }
            }
            state.isPlaying = true;
        },
        prevTrack: (state) => {
            if (!state.currentTrack || state.queue.length === 0) return;
            
            const currentId = getTrackId(state.currentTrack);
            const currentIndex = state.queue.findIndex(t => getTrackId(t) === currentId);
            
            if (currentIndex > 0) {
                state.currentTrack = state.queue[currentIndex - 1];
            } else if (state.repeat === 'all') {
                state.currentTrack = state.queue[state.queue.length - 1];
            }
            state.isPlaying = true;
        }
    }
});

export const { 
    setCurrentTrack, 
    playContext, 
    setQueue, 
    playNext,
    addToQueue,
    removeFromQueue,
    moveQueueTrack,
    setIsPlaying, 
    setVolume, 
    setCurrentTime, 
    setDuration, 
    toggleRepeat, 
    toggleShuffle, 
    nextTrack, 
    prevTrack 
} = playerSlice.actions;

export default playerSlice.reducer;
