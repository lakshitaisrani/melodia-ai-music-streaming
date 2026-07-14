import { useState, useEffect } from 'react';
import { Play, Heart, Trash2, MoreHorizontal, PlaySquare, ListPlus, FolderPlus, User, Disc, Link as LinkIcon, Trash } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useToast } from '../../context/ToastContext';
import AddToPlaylistModal from '../library/AddToPlaylistModal';

const PlaylistSongRow = ({ song, index, onRemove, isOwner, isLiked, onLike }) => {
  const { playNext, addToQueue } = usePlayer();
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClose = () => setIsMenuOpen(false);
    window.addEventListener('click', handleClose);
    return () => window.removeEventListener('click', handleClose);
  }, [isMenuOpen]);

  const handlePlayNext = (e) => {
    e.stopPropagation();
    playNext({
      id: song.videoId || song.id,
      videoId: song.videoId || song.id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.image,
      duration: song.duration
    });
    showToast(`"${song.title}" will play next`);
    setIsMenuOpen(false);
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    addToQueue({
      id: song.videoId || song.id,
      videoId: song.videoId || song.id,
      title: song.title,
      artist: song.artist,
      thumbnail: song.image,
      duration: song.duration
    });
    showToast(`Added "${song.title}" to queue`);
    setIsMenuOpen(false);
  };

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    setShowAddModal(true);
    setIsMenuOpen(false);
  };

  const handleGoToArtist = (e) => {
    e.stopPropagation();
    showToast(`Artist: ${song.artist}`);
    setIsMenuOpen(false);
  };

  const handleGoToAlbum = (e) => {
    e.stopPropagation();
    showToast('Album details page coming soon');
    setIsMenuOpen(false);
  };

  const handleCopyLink = (e) => {
    e.stopPropagation();
    const songUrl = `https://www.youtube.com/watch?v=${song.videoId || song.id}`;
    navigator.clipboard.writeText(songUrl)
      .then(() => showToast('Song link copied.'))
      .catch(() => showToast('Failed to copy song link', 'error'));
    setIsMenuOpen(false);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove();
    setIsMenuOpen(false);
  };

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onLike) onLike();
  };

  return (
    <div className="group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer border-b border-white/5 last:border-0 relative">
      {/* Index & Hover Play */}
      <div className="w-8 text-center text-on-surface-variant font-bold text-sm relative flex-shrink-0">
        <span className="group-hover:opacity-0 transition-opacity">{index + 1}</span>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
          <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
        </div>
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-surface-container">
        <img 
          src={song.image} 
          alt={song.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Title & Artist */}
      <div className="flex-grow min-w-0 md:w-1/3">
        <h5 className="text-on-surface font-semibold truncate group-hover:text-primary transition-colors">{song.title}</h5>
        <p 
          onClick={handleGoToArtist}
          className="text-on-surface-variant text-xs mt-0.5 truncate hover:underline cursor-pointer inline-block"
        >
          {song.artist}
        </p>
      </div>
      
      {/* Album */}
      <div className="hidden md:flex flex-grow min-w-0 md:w-1/4">
        <p 
          onClick={handleGoToAlbum}
          className="text-on-surface-variant text-sm truncate hover:underline cursor-pointer"
        >
          {song.album || 'Unknown Album'}
        </p>
      </div>
      
      {/* Duration */}
      {song.duration && (
        <div className="hidden sm:block text-on-surface-variant text-sm w-16 text-right font-medium">
          {song.duration}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center gap-1 sm:gap-2 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100 ml-2 relative">
        <button 
          onClick={handleHeartClick} 
          className="p-2 text-on-surface-variant hover:text-primary transition-colors active:scale-90"
          title={isLiked ? "Unlike Song" : "Like Song"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary scale-110' : ''}`} />
        </button>
        {isOwner && (
          <button 
            onClick={handleRemove}
            className="p-2 text-on-surface-variant hover:text-error transition-colors hidden lg:block"
            title="Remove from Playlist"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }} 
          className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          title="More Actions"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-56 bg-surface-container-high border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <button 
              onClick={handlePlayNext}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <PlaySquare className="w-4 h-4 text-on-surface-variant" />
              <span>Play Next</span>
            </button>
            <button 
              onClick={handleAddToQueue}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <ListPlus className="w-4 h-4 text-on-surface-variant" />
              <span>Add to Queue</span>
            </button>
            <button 
              onClick={handleAddToPlaylist}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <FolderPlus className="w-4 h-4 text-on-surface-variant" />
              <span>Add to Playlist</span>
            </button>
            <button 
              onClick={handleGoToArtist}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <User className="w-4 h-4 text-on-surface-variant" />
              <span>Go to Artist</span>
            </button>
            <button 
              onClick={handleGoToAlbum}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <Disc className="w-4 h-4 text-on-surface-variant" />
              <span>Go to Album</span>
            </button>
            <button 
              onClick={handleCopyLink}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-white/5 transition-colors text-left"
            >
              <LinkIcon className="w-4 h-4 text-on-surface-variant" />
              <span>Copy Song Link</span>
            </button>
            {isOwner && (
              <button 
                onClick={handleRemove}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error/5 transition-colors text-left border-t border-white/5 mt-1"
              >
                <Trash className="w-4 h-4 text-error" />
                <span>Remove from Playlist</span>
              </button>
            )}
          </div>
        )}
      </div>

      {showAddModal && (
        <AddToPlaylistModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          song={{
            videoId: song.videoId || song.id,
            title: song.title,
            artist: song.artist,
            thumbnail: song.image,
            duration: song.duration
          }}
        />
      )}
    </div>
  );
};

export default PlaylistSongRow;
