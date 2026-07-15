import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeSong, unlikeSong } from '../../redux/librarySlice';
import { setCurrentTrack } from '../../redux/playerSlice';
import apiClient from '../../services/apiClient';
import AddToPlaylistModal from '../library/AddToPlaylistModal';
import YouTube from 'react-youtube';
import { 
  FiShuffle, 
  FiSkipBack, 
  FiPlay, 
  FiPause, 
  FiSkipForward, 
  FiRepeat, 
  FiVolume2, 
  FiVolumeX,
  FiMaximize,
  FiHeart,
  FiTrash2,
  FiMinimize2
} from 'react-icons/fi';
import { MdOutlineQueueMusic, MdOutlineLyrics, MdPlaylistAdd } from 'react-icons/md';
import { BiChevronUp, BiChevronDown, BiLoaderAlt } from 'react-icons/bi';
import { usePlayer } from '../../hooks/usePlayer';
import { getOfflineTrack } from '../../utils/offlineDb';

const formatTime = (timeInSeconds) => {
  if (!timeInSeconds || isNaN(timeInSeconds)) return '0:00';
  const m = Math.floor(timeInSeconds / 60);
  const s = Math.floor(timeInSeconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const BottomPlayer = () => {
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const [lyrics, setLyrics] = useState('');
  const [lyricsLoading, setLyricsLoading] = useState(false);
  
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isAutoplayLoading, setIsAutoplayLoading] = useState(false);

  // Offline playback states
  const [offlineUrl, setOfflineUrl] = useState(null);
  const [isPlayingOffline, setIsPlayingOffline] = useState(false);
  
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.library);
  const { user } = useSelector((state) => state.auth);
  
  const playerRef = useRef(null);
  const audioRef = useRef(null);
  
  const { 
    currentTrack, 
    queue, 
    isPlaying, 
    volume, 
    currentTime, 
    duration, 
    repeat, 
    shuffle,
    togglePlay,
    next,
    prev,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    removeFromQueue,
    moveQueueTrack,
    setVolume,
    setCurrentTime,
    setDuration,
    play,
    pause
  } = usePlayer();

  // Load lyrics dynamically when lyrics are opened or when track changes
  const loadLyrics = async () => {
    if (!currentTrack) return;
    setLyricsLoading(true);
    setLyrics('Searching for lyrics...');
    try {
      const res = await apiClient.post('/ai/lyrics', {
        title: currentTrack.title,
        artist: currentTrack.artist || currentTrack.channelTitle || 'Unknown Artist'
      });
      setLyrics(res.data.lyrics || 'No lyrics available.');
    } catch (err) {
      console.error('================ FRONTEND LYRICS FETCH ERROR ================');
      console.error('Failed to load lyrics:', err.message);
      if (err.response) {
        console.error('HTTP Status:', err.response.status);
        console.error('Response Data:', err.response.data);
      }
      console.error('=============================================================');
      setLyrics('Failed to load lyrics. Click to retry.');
    } finally {
      setLyricsLoading(false);
    }
  };

  useEffect(() => {
    if (isLyricsOpen && currentTrack) {
      loadLyrics();
    }
  }, [currentTrack, isLyricsOpen]);

  // Handle Spotify track resolution dynamically to save YouTube search quota
  useEffect(() => {
    const resolveSpotifyTrack = async () => {
      if (currentTrack && !currentTrack.videoId) {
        try {
          console.log(`Resolving Spotify track: "${currentTrack.title}" by ${currentTrack.artist}`);
          const response = await apiClient.get('/music/resolve', {
            params: {
              title: currentTrack.title,
              artist: currentTrack.artist
            }
          });
          if (response.data && response.data.videoId) {
            console.log(`Resolved successfully to videoId: ${response.data.videoId}`);
            dispatch(setCurrentTrack({
              ...currentTrack,
              videoId: response.data.videoId
            }));
          }
        } catch (error) {
          console.error("Failed to resolve Spotify track to YouTube:", error);
          next();
        }
      }
    };
    resolveSpotifyTrack();
  }, [currentTrack, dispatch]);

  // Sync isPlaying state with Offline HTML5 Audio element
  useEffect(() => {
    if (audioRef.current && isPlayingOffline) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.warn('Offline audio autoplay blocked:', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isPlayingOffline, offlineUrl]);

  // Sync volume state with Offline HTML5 Audio element
  useEffect(() => {
    if (audioRef.current && isPlayingOffline) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted, isPlayingOffline]);

  // Check offline IndexedDB cache when currentTrack changes
  useEffect(() => {
    let active = true;
    const checkOfflineStatus = async () => {
      if (!currentTrack) return;
      const videoId = currentTrack.id || currentTrack.videoId;
      try {
        const record = await getOfflineTrack(videoId);
        if (active) {
          if (record && record.audioBlob) {
            const url = URL.createObjectURL(record.audioBlob);
            setOfflineUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
            setIsPlayingOffline(true);
            console.log(`Loaded offline WAV file for track: "${currentTrack.title}"`);
          } else {
            setOfflineUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return null;
            });
            setIsPlayingOffline(false);
            
            // If completely offline and file not cached, warn and skip
            if (!navigator.onLine) {
              console.warn(`Track not cached offline! Skipping...`);
              next();
            }
          }
        }
      } catch (e) {
        console.error('Failed to query offline IndexedDB:', e);
        if (active) {
          setIsPlayingOffline(false);
        }
      }
    };

    checkOfflineStatus();

    return () => {
      active = false;
    };
  }, [currentTrack]);

  // Clean up Object URL on component unmount
  useEffect(() => {
    return () => {
      if (offlineUrl) URL.revokeObjectURL(offlineUrl);
    };
  }, [offlineUrl]);

  // Handle Play/Pause sync with IFrame (only when playing online)
  useEffect(() => {
    if (playerRef.current && !isPlayingOffline) {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, isPlayingOffline]);

  // Handle Volume sync with IFrame
  useEffect(() => {
    if (playerRef.current && !isPlayingOffline) {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    }
  }, [volume, isMuted, isPlayingOffline]);

  // Time Tracker interval (only when playing online)
  useEffect(() => {
    let interval;
    if (isPlaying && playerRef.current && !isPlayingOffline) {
      interval = setInterval(async () => {
        try {
          const time = await playerRef.current.getCurrentTime();
          const dur = await playerRef.current.getDuration();
          if (time !== undefined) setCurrentTime(time);
          if (dur !== undefined && duration === 0) setDuration(dur);
        } catch (e) {
          // ignore
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, isPlayingOffline, setCurrentTime, setDuration]);

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    if (isPlaying && !isPlayingOffline) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  };

  const triggerAutoplay = async () => {
    if (isAutoplayLoading || !currentTrack) return;
    setIsAutoplayLoading(true);
    try {
      console.log('Autoplay: Queue ended, querying Gemini for recommendations...');
      const response = await apiClient.post('/ai/autoplay', {
        title: currentTrack.title,
        artist: currentTrack.artist || currentTrack.channelTitle || 'Unknown Artist'
      });
      const recommendations = response.data;
      if (recommendations && recommendations.length > 0) {
        console.log(`Autoplay: Fetched ${recommendations.length} recommendations. Appending...`);
        recommendations.forEach(song => {
          addToQueue(song);
        });
        dispatch(setCurrentTrack(recommendations[0]));
      } else {
        next();
      }
    } catch (error) {
      console.error('Autoplay recommendation lookup failed:', error);
      next();
    } finally {
      setIsAutoplayLoading(false);
    }
  };

  const onPlayerStateChange = async (event) => {
    if (isPlayingOffline) return; // Ignore online state events when playing offline
    
    // PLAYING = 1, PAUSED = 2, ENDED = 0
    if (event.data === 1) {
      play();
      setDuration(playerRef.current.getDuration());
    } else if (event.data === 2) {
      pause();
    } else if (event.data === 0) {
      if (repeat === 'one') {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      } else {
        // Autoplay check
        const currentId = currentTrack.id || currentTrack.videoId;
        const currentIndex = queue.findIndex(t => (t.id || t.videoId) === currentId);
        
        if (currentIndex !== -1 && currentIndex === queue.length - 1 && isAutoplayEnabled) {
          await triggerAutoplay();
        } else {
          next();
        }
      }
    }
  };

  // Offline HTML5 Audio Event Handlers
  const handleAudioTimeUpdate = () => {
    if (audioRef.current && isPlayingOffline) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioDurationChange = () => {
    if (audioRef.current && isPlayingOffline) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    if (!isPlayingOffline) return;
    
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e) => console.warn(e));
      }
    } else {
      const currentId = currentTrack.id || currentTrack.videoId;
      const currentIndex = queue.findIndex(t => (t.id || t.videoId) === currentId);
      
      if (currentIndex !== -1 && currentIndex === queue.length - 1 && isAutoplayEnabled) {
        triggerAutoplay();
      } else {
        next();
      }
    }
  };

  const handleSeek = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const seekTime = percent * duration;
    
    if (isPlayingOffline) {
      if (audioRef.current) {
        audioRef.current.currentTime = seekTime;
        setCurrentTime(seekTime);
      }
    } else {
      if (playerRef.current) {
        playerRef.current.seekTo(seekTime);
        setCurrentTime(seekTime);
      }
    }
  };

  const handleVolumeSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVol = Math.max(0, Math.min(100, Math.round(percent * 100)));
    setVolume(newVol);
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  
  if (!currentTrack) return null;

  const videoId = currentTrack.id || currentTrack.videoId;
  const isLiked = likedSongs?.some((s) => s.videoId === videoId);

  const handleLike = () => {
    if (!user) return;
    if (isLiked) {
      dispatch(unlikeSong(videoId));
    } else {
      dispatch(
        likeSong({
          videoId,
          title: currentTrack.title,
          artist: currentTrack.artist || currentTrack.channelTitle || 'Unknown Artist',
          thumbnail: currentTrack.thumbnail || currentTrack.image,
          duration: currentTrack.duration || '0:00',
        })
      );
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      
      {/* Hidden YouTube IFrame */}
      {!isPlayingOffline && (
        <div className="hidden">
          <YouTube 
            videoId={currentTrack.videoId} 
            opts={{
              height: '0',
              width: '0',
              playerVars: { autoplay: 1, controls: 0 }
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            onError={() => next()}
          />
        </div>
      )}

      {/* Offline HTML5 Audio Element */}
      {isPlayingOffline && offlineUrl && (
        <audio 
          ref={audioRef}
          src={offlineUrl}
          onTimeUpdate={handleAudioTimeUpdate}
          onDurationChange={handleAudioDurationChange}
          onEnded={handleAudioEnded}
        />
      )}

      {/* Mini-Lyrics Preview (Slide-up Panel) */}
      <div 
        className={`absolute bottom-full right-4 md:right-[360px] mb-4 w-80 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 transform ${
          isLyricsOpen && !isFullscreen ? 'translate-y-0 opacity-100 pointer-events-auto shadow-2xl shadow-primary/20' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface-dim">
          <span className="text-base font-bold text-primary">Lyrics</span>
          <button 
            onClick={() => loadLyrics()}
            className="text-[10px] font-mono text-on-surface-variant tracking-widest uppercase hover:text-primary transition-colors cursor-pointer"
          >
            Refresh
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto no-scrollbar p-4 text-center">
          {lyricsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-on-surface-variant">
              <BiLoaderAlt className="w-5 h-5 animate-spin text-primary" />
              <span className="text-xs">Fetching lyrics...</span>
            </div>
          ) : (
            <p className="whitespace-pre-line text-sm text-on-surface-variant font-medium leading-relaxed">
              {lyrics}
            </p>
          )}
        </div>
      </div>

      {/* Mini-Queue Preview (Slide-up Panel) */}
      <div 
        className={`absolute bottom-full right-4 md:right-12 mb-4 w-80 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-300 transform ${
          isQueueOpen ? 'translate-y-0 opacity-100 pointer-events-auto shadow-2xl shadow-primary/20' : 'translate-y-4 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-surface-dim gap-2">
          <span className="text-base font-bold text-primary">Up Next</span>
          <button 
            onClick={() => setIsAutoplayEnabled(!isAutoplayEnabled)}
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border transition-all ${
              isAutoplayEnabled 
                ? 'bg-primary/10 border-primary text-primary shadow-[0_0_8px_rgba(221,183,255,0.3)]' 
                : 'bg-transparent border-white/10 text-on-surface-variant'
            }`}
          >
            Autoplay: {isAutoplayEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto no-scrollbar">
          {queue.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className={`flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-pointer group ${item.id === currentTrack.id ? 'bg-white/5' : ''}`}>
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-container shrink-0 relative">
                <img src={item.thumbnail || item.image} alt={item.title} className="w-full h-full object-cover" />
                {item.id === currentTrack.id && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <FiPlay className="text-primary w-4 h-4 fill-current" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${item.id === currentTrack.id ? 'text-primary' : 'text-on-surface'}`}>{item.title}</p>
                <p className="text-xs font-mono text-on-surface-variant truncate mt-0.5">{item.artist}</p>
              </div>
              
              {/* Sort controls and Trash */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1">
                {idx > 0 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveQueueTrack(idx, 'up'); }}
                    className="p-1 text-on-surface-variant hover:text-white hover:bg-white/5 rounded"
                  >
                    <BiChevronUp size={16} />
                  </button>
                )}
                {idx < queue.length - 1 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveQueueTrack(idx, 'down'); }}
                    className="p-1 text-on-surface-variant hover:text-white hover:bg-white/5 rounded"
                  >
                    <BiChevronDown size={16} />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFromQueue(item.id || item.videoId); }}
                  className="p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded"
                >
                  <FiTrash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Player Bar */}
      <div className="w-full bg-surface/85 backdrop-blur-xl border-t border-white/10 px-4 md:px-12 h-24 flex items-center justify-between shadow-2xl select-none">
        
        {/* Left: Metadata */}
        <div className="flex items-center gap-4 w-1/3 lg:w-1/4">
          <div className="relative group shrink-0">
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10 transition-all ${isPlaying ? 'animate-[spin_20s_linear_infinite]' : ''}`}>
              <img src={currentTrack.thumbnail || currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
            </div>
            <div 
              onClick={() => setIsFullscreen(true)}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 rounded-full transition-opacity cursor-pointer"
            >
              <BiChevronUp className="text-white w-6 h-6" />
            </div>
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm md:text-base font-bold tracking-tight text-white leading-none mb-1 truncate">{currentTrack.title}</h3>
            <p className="text-xs md:text-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer truncate font-mono mt-0.5">{currentTrack.artist}</p>
          </div>
          <div className="hidden sm:flex items-center gap-1 ml-2 md:ml-4">
            <button 
              onClick={handleLike} 
              className="p-2 hover:bg-white/5 rounded-full transition-all group active:scale-90"
            >
              <FiHeart className={`w-5 h-5 transition-colors ${isLiked ? 'fill-primary text-primary scale-110' : 'text-on-surface-variant group-hover:text-primary'}`} />
            </button>
            <button 
              onClick={() => setShowPlaylistModal(true)}
              className="p-2 hover:bg-white/5 rounded-full transition-all active:scale-90 hidden md:block"
            >
              <MdPlaylistAdd className="w-5 h-5 text-on-surface-variant hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Center: Controls & Seek */}
        <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl px-4 md:px-8">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={toggleShuffle} className={`transition-colors hidden sm:block ${shuffle ? 'text-primary' : 'text-on-surface-variant hover:text-white'}`}>
              <FiShuffle className="w-5 h-5" />
            </button>
            <button onClick={prev} className="text-on-surface-variant hover:text-white transition-all active:scale-90">
              <FiSkipBack className="w-6 h-6 md:w-7 md:h-7 fill-current" />
            </button>
            <button 
              onClick={togglePlay}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(183,109,255,0.3)] hover:shadow-[0_0_20px_rgba(183,109,255,0.5)] ${isPlaying ? 'bg-tertiary text-on-tertiary shadow-tertiary/10' : 'bg-primary text-on-primary shadow-primary/10'}`}
            >
              {isPlaying ? <FiPause className="w-6 h-6 md:w-7 md:h-7 fill-current" /> : <FiPlay className="w-6 h-6 md:w-7 md:h-7 fill-current ml-1" />}
            </button>
            <button onClick={next} className="text-on-surface-variant hover:text-white transition-all active:scale-90">
              <FiSkipForward className="w-6 h-6 md:w-7 md:h-7 fill-current" />
            </button>
            <button onClick={toggleRepeat} className={`transition-colors hidden sm:block relative ${repeat !== 'none' ? 'text-primary' : 'text-on-surface-variant hover:text-white'}`}>
              <FiRepeat className="w-5 h-5" />
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-primary text-black font-extrabold px-1 rounded-full scale-75">1</span>
              )}
            </button>
          </div>
          <div className="w-full flex items-center gap-3 px-2 md:px-8">
            <span className="text-[10px] md:text-xs font-mono text-on-surface-variant min-w-[32px] md:min-w-[40px] text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1.5 bg-white/10 rounded-full group cursor-pointer" onClick={handleSeek}>
              <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #A855F7 0%, #3cddc7 100%)' }}></div>
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progressPercent}% - 6px)` }}></div>
            </div>
            <span className="text-[10px] md:text-xs font-mono text-on-surface-variant min-w-[32px] md:min-w-[40px]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Secondary Tools */}
        <div className="flex items-center justify-end gap-3 md:gap-4 w-1/3 lg:w-1/4">
          <button 
            onClick={() => setIsQueueOpen(!isQueueOpen)}
            className={`p-2 transition-all hidden md:block ${isQueueOpen ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <MdOutlineQueueMusic className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <button 
            onClick={() => setIsLyricsOpen(!isLyricsOpen)}
            className={`p-2 transition-all hidden lg:block ${isLyricsOpen ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <MdOutlineLyrics className="w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div className="hidden sm:flex items-center gap-2 px-2 group">
            <button onClick={() => setIsMuted(!isMuted)}>
              {isMuted || volume === 0 ? <FiVolumeX className="text-on-surface-variant hover:text-white transition-colors w-5 h-5" /> : <FiVolume2 className="text-on-surface-variant group-hover:text-white transition-colors w-5 h-5" />}
            </button>
            <div className="w-16 md:w-24 h-1 bg-white/10 rounded-full relative cursor-pointer py-2 -my-2" onClick={handleVolumeSeek}>
              <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-white/60 rounded-full group-hover:bg-primary transition-colors" style={{ width: `${isMuted ? 0 : volume}%` }}></div>
            </div>
          </div>
          <button 
            onClick={() => setIsFullscreen(true)}
            className="p-2 text-on-surface-variant hover:text-white transition-all hidden sm:block"
          >
            <FiMaximize className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Fullscreen Overlay Component */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-[#09080c]/98 backdrop-blur-3xl flex flex-col justify-between p-6 md:p-10 animate-fade-in text-on-surface select-none">
           {/* Top Bar: Close button */}
           <div className="flex justify-between items-center w-full z-10">
             <button onClick={() => setIsFullscreen(false)} className="p-3 hover:bg-white/5 rounded-2xl text-on-surface-variant hover:text-white transition-all active:scale-95">
               <FiMinimize2 size={24} />
             </button>
             <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant font-extrabold">Now Playing</span>
             <button onClick={() => setIsLyricsOpen(!isLyricsOpen)} className={`p-3 rounded-2xl transition-all ${isLyricsOpen ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-white'}`}>
               <MdOutlineLyrics size={24} />
             </button>
           </div>

           {/* Middle Panel: Album Cover & Lyrics Side-by-Side */}
           <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full max-w-5xl mx-auto overflow-hidden my-4">
             {/* Left: Spinning cover art */}
             <div className={`flex flex-col items-center justify-center transition-all duration-500 ${isLyricsOpen ? 'w-full md:w-1/2' : 'w-full max-w-md'}`}>
               <div className={`w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-[6px] border-white/5 shadow-2xl relative group ${isPlaying ? 'animate-[spin_25s_linear_infinite]' : ''}`}>
                 {/* Inner vinyl details */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10 pointer-events-none" />
                 <img src={currentTrack.thumbnail || currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
                 {/* Center hole */}
                 <div className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#09080c] border-4 border-white/10 z-20 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                 </div>
               </div>
               <div className="text-center mt-6 max-w-xs md:max-w-sm">
                 <h2 className="text-lg md:text-xl lg:text-2xl font-black tracking-tight text-white mb-1.5 truncate">{currentTrack.title}</h2>
                 <p className="text-xs md:text-sm font-mono text-primary font-bold truncate">{currentTrack.artist}</p>
                 {isPlayingOffline && (
                   <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#3cddc7]/10 border border-[#3cddc7]/20 text-[10px] font-mono text-[#3cddc7] font-semibold">
                     Offline Cache
                   </span>
                 )}
               </div>
             </div>

             {/* Right: Scrolling Lyrics Column with elegant gradient fade */}
             <div className={`w-full md:w-1/2 h-[320px] md:h-[400px] rounded-3xl bg-white/5 border border-white/5 overflow-hidden relative transition-all duration-500 ${isLyricsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none hidden md:block'}`}>
               {/* Fading Edge Overlays */}
               <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#09080c] to-transparent pointer-events-none z-10"></div>
               <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#09080c] to-transparent pointer-events-none z-10"></div>
               
               {/* Scrollable Container */}
               <div className="w-full h-full overflow-y-auto no-scrollbar p-6 md:p-8 flex flex-col items-center justify-start text-center scroll-smooth">
                 {lyricsLoading ? (
                   <div className="flex flex-col items-center justify-center h-full w-full gap-3 text-on-surface-variant">
                     <BiLoaderAlt className="w-6 h-6 animate-spin text-primary" />
                     <span className="text-xs font-bold font-mono">Curating lyrics...</span>
                   </div>
                 ) : (
                   <div className="whitespace-pre-line text-sm md:text-base lg:text-lg font-bold leading-loose text-white/70 hover:text-white transition-colors duration-300 py-12 px-2 font-sans selection:bg-primary/20 selection:text-white">
                     {lyrics}
                   </div>
                 )}
               </div>
             </div>
           </div>

           {/* Bottom Panel: Large Controls & Playback Track bar */}
           <div className="w-full max-w-3xl mx-auto flex flex-col gap-4 items-center">
             {/* Progress track */}
             <div className="w-full flex items-center gap-4 px-2">
               <span className="text-xs font-mono text-on-surface-variant w-10 text-right">{formatTime(currentTime)}</span>
               <div className="relative flex-grow h-1.5 bg-white/10 rounded-full group cursor-pointer" onClick={handleSeek}>
                 <div className="absolute top-0 left-0 h-full rounded-full" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #A855F7 0%, #3cddc7 100%)' }}></div>
                 <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-2xl opacity-100 group-hover:scale-125 transition-transform" style={{ left: `calc(${progressPercent}% - 7px)` }}></div>
               </div>
               <span className="text-xs font-mono text-on-surface-variant w-10">{formatTime(duration)}</span>
             </div>

             {/* Controls */}
             <div className="flex items-center justify-between w-full max-w-xs px-4 my-2">
               <button onClick={toggleShuffle} className={`transition-all p-2 rounded-full hover:bg-white/5 active:scale-90 ${shuffle ? 'text-primary' : 'text-on-surface-variant'}`}>
                 <FiShuffle className="w-5 h-5" />
               </button>
               <button onClick={prev} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-white transition-all active:scale-90">
                 <FiSkipBack className="w-6 h-6 fill-current" />
               </button>
               <button 
                 onClick={togglePlay}
                 className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-2xl hover:scale-105 ${isPlaying ? 'bg-tertiary text-on-tertiary shadow-tertiary/20' : 'bg-primary text-on-primary shadow-primary/20'}`}
               >
                 {isPlaying ? <FiPause className="w-6 h-6 fill-current" /> : <FiPlay className="w-6 h-6 fill-current ml-1" />}
               </button>
               <button onClick={next} className="p-2 rounded-full hover:bg-white/5 text-on-surface-variant hover:text-white transition-all active:scale-90">
                 <FiSkipForward className="w-6 h-6 fill-current" />
               </button>
               <button onClick={toggleRepeat} className="p-2 rounded-full hover:bg-white/5 transition-all active:scale-90 relative">
                 <FiRepeat className={`w-5 h-5 ${repeat !== 'none' ? 'text-primary' : 'text-on-surface-variant'}`} />
                 {repeat === 'one' && (
                   <span className="absolute top-1 right-1 text-[8px] bg-primary text-black font-extrabold px-1 rounded-full scale-75">1</span>
                 )}
               </button>
             </div>
           </div>
        </div>
      )}

      <AddToPlaylistModal 
        isOpen={showPlaylistModal} 
        onClose={() => setShowPlaylistModal(false)}
        song={currentTrack}
      />
    </div>
  );
};

export default BottomPlayer;
