import { useDispatch, useSelector } from 'react-redux';
import { 
    playContext, 
    setIsPlaying, 
    setVolume, 
    setCurrentTime, 
    setDuration, 
    toggleRepeat, 
    toggleShuffle, 
    nextTrack, 
    prevTrack,
    playNext,
    addToQueue,
    removeFromQueue,
    moveQueueTrack
} from '../redux/playerSlice';

export const usePlayer = () => {
    const dispatch = useDispatch();
    const playerState = useSelector(state => state.player);

    return {
        ...playerState,
        
        // Play an entirely new context (a song within a list)
        playTrack: (track, list = []) => {
            dispatch(playContext({ track, list }));
        },
        
        // Player controls (state)
        togglePlay: () => dispatch(setIsPlaying(!playerState.isPlaying)),
        pause: () => dispatch(setIsPlaying(false)),
        play: () => dispatch(setIsPlaying(true)),
        
        next: () => dispatch(nextTrack()),
        prev: () => dispatch(prevTrack()),
        
        toggleRepeat: () => dispatch(toggleRepeat()),
        toggleShuffle: () => dispatch(toggleShuffle()),
        
        // Queue operations
        playNext: (track) => dispatch(playNext(track)),
        addToQueue: (track) => dispatch(addToQueue(track)),
        removeFromQueue: (videoId) => dispatch(removeFromQueue(videoId)),
        moveQueueTrack: (index, direction) => dispatch(moveQueueTrack({ index, direction })),
        
        // Time & Volume
        setVolume: (vol) => dispatch(setVolume(vol)),
        setCurrentTime: (time) => dispatch(setCurrentTime(time)),
        setDuration: (dur) => dispatch(setDuration(dur))
    };
};

export default usePlayer;
