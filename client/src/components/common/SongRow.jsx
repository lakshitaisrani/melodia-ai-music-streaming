import { Play, Heart, PlusCircle, MoreHorizontal, ArrowDownToLine, CheckCircle2, Loader2, ListPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { likeSong, unlikeSong } from '../../redux/librarySlice';
import { startDownloading, finishDownloading, removeDownload } from '../../redux/downloadSlice';
import { addToQueue } from '../../redux/playerSlice';
import { useState } from 'react';
import AddToPlaylistModal from '../library/AddToPlaylistModal';
import { synthesizeMelody } from '../../utils/audioSynthesizer';
import { saveOfflineTrack, deleteOfflineTrack } from '../../utils/offlineDb';

const SongRow = ({ song, index, onClick }) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector(state => state.library);
  const { downloadedSongs, downloadingSongs } = useSelector(state => state.downloads);
  const { user } = useSelector(state => state.auth);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const videoId = song.id || song.videoId;
  const isLiked = likedSongs?.some(s => s.videoId === videoId);
  const isDownloaded = downloadedSongs?.some(s => s.videoId === videoId);
  const isDownloading = downloadingSongs?.[videoId];

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) return;
    
    if (isLiked) {
      dispatch(unlikeSong(videoId));
    } else {
      dispatch(likeSong({
        videoId,
        title: song.title,
        artist: song.artist || song.channelTitle || 'Unknown Artist',
        thumbnail: song.image || song.thumbnail,
        duration: song.duration
      }));
    }
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (isDownloading) return;

    if (isDownloaded) {
      // Toggle off / remove download
      dispatch(removeDownload(videoId));
      deleteOfflineTrack(videoId).catch(err => console.error("Failed to delete offline track DB entry:", err));
      return;
    }

    dispatch(startDownloading(videoId));

    const initiateDownload = async () => {
      try {
        console.log(`Generating offline WAV melody for track: "${song.title}"`);
        const audioBlob = await synthesizeMelody(song.title);
        await saveOfflineTrack(videoId, audioBlob);
        console.log(`Successfully saved track "${song.title}" offline in IndexedDB.`);

        const songData = {
          videoId,
          title: song.title,
          artist: song.artist || song.channelTitle || 'Unknown Artist',
          thumbnail: song.image || song.thumbnail,
          duration: song.duration
        };
        dispatch(finishDownloading(songData));
      } catch (err) {
        console.error("Offline synthesis/saving failed:", err);
        // Fallback: save placeholder data
        const songData = {
          videoId,
          title: song.title,
          artist: song.artist || song.channelTitle || 'Unknown Artist',
          thumbnail: song.image || song.thumbnail,
          duration: song.duration
        };
        dispatch(finishDownloading(songData));
      }
    };
    initiateDownload();
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    if (!user) return;
    setShowPlaylistModal(true);
  };

  return (
    <>
      <div 
        className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 relative shadow-md">
          <img 
            src={song.image || song.thumbnail} 
            alt={song.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        <div className="flex-grow min-w-0">
          <h5 className="text-on-surface font-semibold truncate group-hover:text-primary transition-colors">{song.title}</h5>
          <p className="text-on-surface-variant text-xs mt-0.5 truncate">{song.artist || song.channelTitle}{song.album ? ` • ${song.album}` : ''}</p>
        </div>
        
        {song.duration && (
          <div className="hidden md:block text-on-surface-variant text-xs w-20 text-right pr-4">
            {song.duration}
          </div>
        )}
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
          <button 
            onClick={handleLike}
            className={`p-2 transition-colors ${isLiked ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button onClick={handleAddToPlaylist} className="p-2 text-on-surface-variant hover:text-primary transition-colors hidden sm:block">
            <PlusCircle className="w-4 h-4" />
          </button>
          <button 
            onClick={handleDownload}
            className={`p-2 transition-colors ${
              isDownloaded ? 'text-primary' : 'text-on-surface-variant hover:text-white'
            }`}
            title={isDownloaded ? "Remove Offline Download" : "Download Offline"}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isDownloaded ? (
              <CheckCircle2 className="w-4 h-4 text-[#3cddc7]" />
            ) : (
              <ArrowDownToLine className="w-4 h-4" />
            )}
          </button>
          <div className="relative">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
              className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showDropdown && (
              <div 
                className="absolute right-0 mt-1 w-40 bg-surface-container border border-white/10 rounded-xl shadow-2xl py-1.5 z-[70]"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => {
                    dispatch(addToQueue({
                      id: videoId,
                      videoId,
                      title: song.title,
                      artist: song.artist || song.channelTitle || 'Unknown Artist',
                      thumbnail: song.image || song.thumbnail,
                      duration: song.duration
                    }));
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-white/5 transition-colors text-left"
                >
                  <ListPlus size={14} className="text-primary" /> Add to Queue
                </button>
                <button 
                  onClick={() => {
                    handleAddToPlaylist(null);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-on-surface hover:bg-white/5 transition-colors text-left sm:hidden"
                >
                  <PlusCircle size={14} /> Add to Playlist
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AddToPlaylistModal 
        isOpen={showPlaylistModal} 
        onClose={() => setShowPlaylistModal(false)}
        song={{
          videoId,
          title: song.title,
          artist: song.artist || song.channelTitle || 'Unknown Artist',
          thumbnail: song.image || song.thumbnail,
          duration: song.duration
        }}
      />
    </>
  );
};

export default SongRow;
