import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { updatePlaylist } from '../../redux/playlistSlice';
import UploadField from '../library/UploadField';
import PlaylistForm from '../library/PlaylistForm';

const EditPlaylistModal = ({ isOpen, onClose, playlist, onSaveSuccess }) => {
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

  useEffect(() => {
    if (playlist && isOpen) {
      setForm({
        name: playlist.title || '',
        description: playlist.description || '',
        genre: playlist.genre || '',
        privacy: playlist.privacy || 'Public',
        tags: playlist.tags || [],
        image: playlist.image || playlist.coverImage || null,
      });
    }
  }, [playlist, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (url) => {
    setForm(prev => ({ ...prev, image: url }));
  };

  const handleSave = async () => {
    if (!form.name.trim() || isSubmitting || isUploading) return;
    
    setIsSubmitting(true);
    try {
      const data = {
        title: form.name,
        description: form.description,
        genre: form.genre,
        privacy: form.privacy,
        tags: form.tags,
        coverImage: form.image
      };

      await dispatch(updatePlaylist({ id: playlist.id || playlist._id, data })).unwrap();
      if (onSaveSuccess) onSaveSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update playlist:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-surface-container-high rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:px-8 border-b border-white/10 flex-shrink-0">
          <h2 className="font-headline-md text-2xl font-extrabold text-on-surface tracking-tight">Edit Details</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-white/5 transition-colors focus:outline-none focus:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content Body */}
        <div className="flex flex-col md:flex-row flex-grow overflow-y-auto p-6 md:p-8 gap-8 custom-scrollbar">
          {/* Left Side: Upload Image */}
          <div className="w-full md:w-2/5 flex flex-col gap-4">
            <label className="block text-xs font-bold text-primary uppercase tracking-widest">Cover Image</label>
            <UploadField image={form.image} onImageChange={handleImageChange} onUploading={setIsUploading} />
          </div>

          {/* Right Side: Metadata Form */}
          <div className="w-full md:w-3/5">
            <PlaylistForm form={form} setForm={setForm} />
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPlaylistModal;
