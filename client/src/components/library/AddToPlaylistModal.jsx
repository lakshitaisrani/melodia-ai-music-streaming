import { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addSongToPlaylist } from '../../redux/playlistSlice';

const AddToPlaylistModal = ({ isOpen, onClose, song }) => {
  const dispatch = useDispatch();
  const { playlists, loading } = useSelector((state) => state.playlist);
  const [addingTo, setAddingTo] = useState(null);

  if (!isOpen) return null;

  const handleAddToPlaylist = async (playlistId) => {
    setAddingTo(playlistId);
    try {
      await dispatch(addSongToPlaylist({ id: playlistId, song })).unwrap();
      setTimeout(() => {
        setAddingTo(null);
        onClose();
      }, 500);
    } catch (err) {
      setAddingTo(null);
      console.error("Failed to add song to playlist:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-surface-container border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-high/50">
          <h3 className="text-lg font-bold text-on-surface">Add to Playlist</h3>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {playlists.length === 0 ? (
            <div className="text-center py-8 text-on-surface-variant">
              <p>You don't have any playlists yet.</p>
              <p className="text-sm mt-1">Create one from the Library page!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {playlists.map(playlist => {
                const isAdded = addingTo === playlist._id;
                
                return (
                  <button
                    key={playlist._id}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                    disabled={addingTo !== null}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-container-highest flex-shrink-0">
                      {playlist.coverImage ? (
                        <img src={playlist.coverImage} alt={playlist.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xl">🎵</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                        {playlist.title}
                      </h4>
                      <p className="text-xs text-on-surface-variant truncate mt-0.5">
                        {playlist.songs?.length || 0} songs
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {isAdded ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
