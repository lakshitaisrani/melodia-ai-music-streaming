import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateSmartPlaylist } from '../../redux/playlistSlice';
import { useToast } from '../../context/ToastContext';

const GenerateSmartPlaylistModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(10);
  const [isPublic, setIsPublic] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setLoadingMessage('Consulting AI & Curating tracks...');

    try {
      const result = await dispatch(generateSmartPlaylist({
        title: title.trim(),
        prompt: prompt.trim(),
        count,
        isPublic
      })).unwrap();
      
      setLoadingMessage('Success!');
      
      setTimeout(() => {
        setLoading(false);
        setTitle('');
        setPrompt('');
        setCount(10);
        setIsPublic(false);
        onClose();
        navigate(`/playlist/${result._id}`);
      }, 500);

    } catch (err) {
      console.error(err);
      const errorMsg = typeof err === 'string' ? err : (err?.error || err?.message || JSON.stringify(err) || "Failed to generate playlist. Please try again.");
      setError(errorMsg);
      showToast(errorMsg, "error");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={!loading ? onClose : undefined}>
      <div 
        className="bg-surface-container border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-surface-container-high/50">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generate Smart Playlist
          </h3>
          <button 
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            className="p-2 text-on-surface-variant hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1.5">
              Playlist Name (Optional)
            </label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Neon Nights Drive"
              disabled={loading}
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-on-surface-variant mb-1.5">
              What's the vibe? (Prompt) *
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Upbeat 80s synthwave for driving at night..."
              disabled={loading}
              required
              rows={3}
              className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-on-surface-variant mb-1.5">
                Song Count
              </label>
              <select 
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={loading}
                className="w-full bg-surface-container-highest border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all appearance-none"
              >
                <option value={5}>5 Songs (Quick)</option>
                <option value={10}>10 Songs (Standard)</option>
                <option value={20}>20 Songs (Long)</option>
                <option value={30}>30 Songs (Extended)</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col justify-center pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only" 
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    disabled={loading}
                  />
                  <div className={`block w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-primary' : 'bg-surface-container-highest border border-white/10'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublic ? 'translate-x-4' : ''}`}></div>
                </div>
                <span className="text-sm font-bold text-on-surface-variant">Public</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {loadingMessage}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" fill="currentColor" />
                  Generate Playlist
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateSmartPlaylistModal;
