import { Play, Shuffle, Heart, Share2, Edit2, Trash2, Bookmark } from 'lucide-react';

const PlaylistHeader = ({ 
  playlist, 
  onPlay, 
  onShuffle, 
  onLike, 
  onSave,
  onShare, 
  onEdit, 
  onDelete, 
  isLiked, 
  isSaved,
  isLikeLoading,
  isSaveLoading,
  isShuffled, 
  isOwner 
}) => {
  const isAI = playlist.playlistType === 'ai';
  
  return (
    <div className="relative pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden border-b border-white/5">
      {/* Background blurred image */}
      <div 
        className="absolute inset-0 z-0 opacity-20 blur-[100px] scale-150 transform-gpu"
        style={{ backgroundImage: `url(${playlist.image})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-surface" />

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-end">
        {/* Cover Image */}
        <div className="w-56 h-56 md:w-64 md:h-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 group">
          <img 
            src={playlist.image} 
            alt={playlist.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Playlist Info */}
        <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-bold text-xs uppercase tracking-widest">Public Playlist</span>
            <span className="text-on-surface-variant/40 text-xs">•</span>
            {isAI && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-extrabold text-primary uppercase tracking-wider">
                AI Generated
              </span>
            )}
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">{playlist.title}</h1>
          <p className="text-on-surface-variant text-base mb-6 max-w-2xl drop-shadow-md">{playlist.description}</p>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-on-surface-variant mb-8">
            <span className="font-bold text-on-surface hover:underline cursor-pointer">{playlist.creator}</span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/50"></span>
            <span>{playlist.songCount} songs</span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/50"></span>
            <span>{playlist.duration}</span>
            <span className="w-1 h-1 rounded-full bg-on-surface-variant/50"></span>
            <span>Created {playlist.createdDate}</span>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full">
            <button 
              onClick={onPlay}
              className="w-14 h-14 rounded-full bg-primary text-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-primary/20"
              title="Play Playlist"
            >
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </button>
            <button 
              onClick={onShuffle}
              className={`w-14 h-14 rounded-full bg-surface-container border flex items-center justify-center hover:bg-white/10 hover:scale-105 active:scale-95 transition-all ${
                isShuffled 
                  ? 'text-primary border-primary/40 shadow-[0_0_12px_rgba(221,183,255,0.2)]' 
                  : 'text-on-surface border-white/10'
              }`}
              title="Shuffle Playlist"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button 
              onClick={onLike}
              disabled={isLikeLoading}
              className={`p-3 transition-colors active:scale-90 ${
                isLikeLoading ? 'cursor-not-allowed' : 'text-on-surface-variant hover:text-primary'
              }`}
              title={isLiked ? "Unlike Playlist" : "Like Playlist"}
            >
              <Heart className={`w-6 h-6 transition-all duration-200 ease-in-out transform ${
                isLiked ? 'fill-primary text-primary scale-110' : 'text-on-surface-variant scale-100'
              } ${isLikeLoading ? 'animate-pulse opacity-50' : ''}`} />
            </button>
            <button 
              onClick={onSave}
              disabled={isSaveLoading}
              className={`p-3 transition-colors active:scale-90 ${
                isSaveLoading ? 'cursor-not-allowed' : 'text-on-surface-variant hover:text-primary'
              }`}
              title={isSaved ? "Remove from Library" : "Save to Library"}
            >
              <Bookmark className={`w-6 h-6 transition-all duration-200 ease-in-out transform ${
                isSaved ? 'fill-primary text-primary scale-110' : 'text-on-surface-variant scale-100'
              } ${isSaveLoading ? 'animate-pulse opacity-50' : ''}`} />
            </button>
            <button 
              onClick={onShare}
              className="p-3 text-on-surface-variant hover:text-on-surface transition-colors active:scale-90"
              title="Share Playlist"
            >
              <Share2 className="w-6 h-6" />
            </button>
            
            <div className="flex-grow"></div>
            
            {isOwner && (
              <>
                <button 
                  onClick={onEdit}
                  className="p-3 text-on-surface-variant hover:text-on-surface transition-colors" 
                  title="Edit Details"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={onDelete}
                  className="p-3 text-on-surface-variant hover:text-error transition-colors" 
                  title="Delete Playlist"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistHeader;
