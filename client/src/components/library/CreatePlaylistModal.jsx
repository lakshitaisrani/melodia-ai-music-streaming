import { useState } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { createPlaylist } from '../../redux/playlistSlice';
import UploadField from './UploadField';
import PlaylistForm from './PlaylistForm';
import SongSelector from './SongSelector';
import SelectedSongList from './SelectedSongList';

const CreatePlaylistModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    genre: '',
    privacy: 'Public',
    tags: [],
    image: null,
  });
  
  const [selectedSongs, setSelectedSongs] = useState([]);

  if (!isOpen) return null;

  const handleImageChange = (url) => {
    setForm(prev => ({ ...prev, image: url }));
  };

  const handleSelectSong = (song) => {
    setSelectedSongs(prev => [...prev, song]);
  };

  const handleDeselectSong = (id) => {
    setSelectedSongs(prev => prev.filter(s => s.id !== id && s.videoId !== id));
  };

  const handleSave = async () => {
    if (!form.name.trim() || isSubmitting || isUploading) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        title: form.name,
        description: form.description,
        coverImage: form.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500',
        songs: selectedSongs.map(s => ({
          videoId: s.id || s.videoId,
          title: s.title,
          artist: s.artist || s.channelTitle || 'Unknown Artist',
          thumbnail: s.image || s.thumbnail,
          duration: s.duration
        }))
      };

      await dispatch(createPlaylist(payload)).unwrap();
      
      // Reset state and close
      setForm({
        name: '',
        description: '',
        genre: '',
        privacy: 'Public',
        tags: [],
        image: null,
      });
      setSelectedSongs([]);
      onClose();
    } catch (error) {
      console.error('Failed to create playlist:', error);
      // Optional: Add toast error notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-surface-container-high rounded-3xl shadow-2xl border border-white/10 flex flex-col md:max-h-[90vh] min-h-[600px] animate-in fade-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 border-b border-white/10 flex-shrink-0">
          <h2 className="font-headline-md text-2xl font-extrabold text-on-surface tracking-tight">Create Playlist</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content Body - Split View */}
        <div className="flex flex-col xl:flex-row flex-grow overflow-y-auto xl:overflow-hidden">
          
          {/* Left Column: Form & Metadata */}
          <div className="w-full xl:w-[45%] p-6 md:px-8 xl:border-r border-white/10 xl:overflow-y-auto custom-scrollbar flex flex-col gap-8">
            <UploadField image={form.image} onImageChange={handleImageChange} onUploading={setIsUploading} />
            <PlaylistForm form={form} setForm={setForm} />
          </div>

          {/* Right Column: Song Selection */}
          <div className="w-full xl:w-[55%] p-6 md:px-8 bg-surface-container/30 xl:overflow-y-auto flex flex-col gap-6 custom-scrollbar">
            
            {/* Selected Songs */}
            <div className="flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Selected Songs</h3>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/20 text-primary">
                  {selectedSongs.length}
                </span>
              </div>
              <SelectedSongList songs={selectedSongs} onRemove={handleDeselectSong} />
            </div>

            {/* Divider */}
            <div className="border-t border-white/5"></div>

            {/* Song Browser */}
            <div className="flex-grow flex flex-col min-h-[300px]">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest mb-3">Browse & Add</h3>
              <SongSelector 
                selectedSongs={selectedSongs} 
                onSelect={handleSelectSong} 
                onDeselect={handleDeselectSong} 
              />
            </div>
            
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-end gap-4 p-6 md:px-8 border-t border-white/10 bg-surface-container/50 flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-on-surface hover:bg-white/5 transition-colors focus:outline-none"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!form.name.trim() || isSubmitting || isUploading}
            className="px-8 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            Save Playlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
