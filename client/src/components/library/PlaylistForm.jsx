import { Lock, Globe } from 'lucide-react';

const PlaylistForm = ({ form, setForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePrivacy = (privacy) => {
    setForm(prev => ({ ...prev, privacy }));
  };

  const handleToggleTag = (tag) => {
    setForm(prev => {
      const currentTags = prev.tags || [];
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const availableTags = ['Chill', 'Workout', 'Focus', 'Party', 'Acoustic', 'Upbeat'];
  const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Jazz', 'Classical', 'Indie'];

  return (
    <div className="space-y-6">
      {/* Playlist Name */}
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2" htmlFor="name">
          Playlist Name <span className="text-error">*</span>
        </label>
        <input 
          id="name"
          name="name"
          type="text" 
          value={form.name}
          onChange={handleChange}
          placeholder="My Awesome Playlist"
          className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2" htmlFor="description">
          Description
        </label>
        <textarea 
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Give your playlist a catchy description"
          rows="3"
          className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
        ></textarea>
      </div>

      {/* Genre */}
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2" htmlFor="genre">
          Genre
        </label>
        <select
          id="genre"
          name="genre"
          value={form.genre}
          onChange={handleChange}
          className="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
        >
          <option value="" disabled>Select a genre</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Privacy Toggle */}
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
          Privacy
        </label>
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => handleTogglePrivacy('Public')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              form.privacy === 'Public' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-surface-container border-white/10 text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-bold">Public</span>
          </button>
          <button 
            type="button"
            onClick={() => handleTogglePrivacy('Private')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              form.privacy === 'Private' 
                ? 'bg-primary/20 border-primary text-primary' 
                : 'bg-surface-container border-white/10 text-on-surface-variant hover:bg-white/5'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm font-bold">Private</span>
          </button>
        </div>
      </div>

      {/* Mood Tags */}
      <div>
        <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">
          Mood Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleToggleTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                form.tags.includes(tag)
                  ? 'bg-primary text-on-primary border-primary shadow-lg shadow-primary/20'
                  : 'bg-surface-container text-on-surface-variant border-white/10 hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistForm;
