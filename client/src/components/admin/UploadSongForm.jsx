import { useState } from 'react';
import { UploadCloud, Music, Image as ImageIcon } from 'lucide-react';

const UploadSongForm = () => {
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    duration: '',
    releaseDate: '',
  });

  const genres = ['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Jazz', 'Classical', 'Indie'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUploadClick = (type) => {
    // Just a mock interaction
    console.log(`Triggering upload for ${type}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Uploading song...', form);
    // Reset form after mock submission
    alert('Song uploaded successfully! (Mock)');
  };

  return (
    <div className="bg-surface-container rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl">
      <h2 className="text-xl font-bold text-on-surface mb-6">Upload New Song</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        
        {/* Dropzones */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Audio Dropzone */}
          <div 
            onClick={() => handleUploadClick('audio')}
            className="flex-1 h-48 bg-surface-container-high rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group"
          >
            <Music className="w-10 h-10 mb-3 group-hover:text-primary transition-colors" />
            <span className="text-sm font-bold group-hover:text-primary transition-colors">Upload Audio File</span>
            <span className="text-xs mt-1 opacity-60">MP3, WAV up to 50MB</span>
          </div>

          {/* Cover Art Dropzone */}
          <div 
            onClick={() => handleUploadClick('cover')}
            className="flex-1 h-48 bg-surface-container-high rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-on-surface-variant cursor-pointer hover:bg-white/5 hover:border-primary/50 transition-all group"
          >
            <ImageIcon className="w-10 h-10 mb-3 group-hover:text-primary transition-colors" />
            <span className="text-sm font-bold group-hover:text-primary transition-colors">Upload Cover Art</span>
            <span className="text-xs mt-1 opacity-60">JPEG, PNG up to 5MB</span>
          </div>
        </div>

        <div className="border-t border-white/5"></div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Song Title *</label>
            <input 
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Blinding Lights"
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Artist *</label>
            <input 
              name="artist"
              value={form.artist}
              onChange={handleChange}
              required
              placeholder="e.g. The Weeknd"
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Album</label>
            <input 
              name="album"
              value={form.album}
              onChange={handleChange}
              placeholder="Optional"
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Genre *</label>
            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none"
            >
              <option value="" disabled>Select a genre</option>
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Duration *</label>
            <input 
              name="duration"
              value={form.duration}
              onChange={handleChange}
              required
              placeholder="e.g. 3:20"
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-primary uppercase tracking-widest mb-2">Release Date *</label>
            <input 
              name="releaseDate"
              type="date"
              value={form.releaseDate}
              onChange={handleChange}
              required
              className="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-on-primary font-bold text-sm hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 transition-all"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Song
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadSongForm;
