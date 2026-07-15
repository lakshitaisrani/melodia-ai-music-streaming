import { Play, Sparkles } from 'lucide-react';

const PlaylistCard = ({ playlist }) => {
  const isAI = playlist.playlistType === 'ai';
  return (
    <div className="relative aspect-[3/4] md:aspect-[4/5] rounded-3xl overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-shadow">
      <div 
        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
        style={{ backgroundImage: `url('${playlist.image}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
      
      {/* Playlist Type Badge */}
      <div className="absolute top-4 left-4 z-10">
        {isAI && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-extrabold text-primary shadow-lg uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-primary animate-pulse" />
            <span>AI Generated</span>
          </span>
        )}
      </div>

      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-[-10px] group-hover:translate-y-0 duration-300">
        <button className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-xl hover:scale-105 active:scale-95 transition-transform">
          <Play className="w-5 h-5 ml-1" fill="currentColor" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h4 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight">{playlist.title}</h4>
        <p className="text-on-surface-variant text-sm line-clamp-2 drop-shadow-md font-medium">{playlist.description}</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
