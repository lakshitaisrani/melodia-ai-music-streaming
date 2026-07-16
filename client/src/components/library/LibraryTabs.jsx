const LibraryTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-6 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
      <button 
        onClick={() => onTabChange('liked')}
        className={`pb-4 font-bold transition-all relative shrink-0 ${activeTab === 'liked' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
      >
        ❤️ Liked Songs
        {activeTab === 'liked' && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_8px_rgba(221,183,255,0.8)]" />
        )}
      </button>
      <button 
        onClick={() => onTabChange('playlists')}
        className={`pb-4 font-bold transition-all relative shrink-0 ${activeTab === 'playlists' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
      >
        📂 My Playlists
        {activeTab === 'playlists' && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_8px_rgba(221,183,255,0.8)]" />
        )}
      </button>
      <button 
        onClick={() => onTabChange('ai')}
        className={`pb-4 font-bold transition-all relative shrink-0 ${activeTab === 'ai' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
      >
        🤖 AI Playlists
        {activeTab === 'ai' && (
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_8px_rgba(221,183,255,0.8)]" />
        )}
      </button>
    </div>
  );
};

export default LibraryTabs;
