import { Play, Plus } from 'lucide-react';

const HeroBanner = ({ song, onPlay }) => {
  if (!song) return null;

  return (
    <section className="relative h-[550px] w-full overflow-hidden rounded-3xl group mb-12 shadow-2xl">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
        style={{ backgroundImage: `url('${song.thumbnail}')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
      
      <div className="absolute bottom-0 left-0 p-8 md:p-14 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
              Featured Trending Hit
            </span>
          </div>
          <h2 className="font-extrabold text-5xl md:text-7xl mb-4 text-white drop-shadow-xl tracking-tighter leading-none line-clamp-2">
            {song.title}
          </h2>
          <p className="text-lg md:text-xl text-on-surface-variant/90 drop-shadow-md font-medium">
            {song.artist} • Now Trending
          </p>
        </div>
        
        <div className="flex items-center gap-4 shrink-0 pb-1">
          <button 
            onClick={onPlay}
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-primary/30 text-on-primary bg-primary"
          >
            <Play className="w-6 h-6 md:w-8 md:h-8" fill="currentColor" />
          </button>
          <button className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:scale-105 active:scale-95 transition-all text-white">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
