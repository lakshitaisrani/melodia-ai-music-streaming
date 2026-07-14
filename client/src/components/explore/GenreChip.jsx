import { Music, Zap, Video, Mic, Headphones, Tv } from 'lucide-react';

const iconMap = {
  piano: Music,
  electric_bolt: Zap,
  music_video: Video,
  mic_external_on: Mic,
  headset: Headphones,
  stadium: Tv
};

const GenreChip = ({ genre }) => {
  const IconComponent = iconMap[genre.icon] || Music;

  return (
    <div className={`relative h-28 md:h-32 rounded-2xl overflow-hidden bg-gradient-to-br ${genre.gradient} flex flex-col items-start justify-end p-4 md:p-5 cursor-pointer hover:brightness-110 active:scale-95 transition-all shadow-lg group`}>
      <IconComponent className={`absolute right-[-10px] top-[-10px] w-24 h-24 md:w-32 md:h-32 opacity-20 ${genre.textColor} group-hover:rotate-12 transition-transform duration-500`} />
      <span className={`font-extrabold ${genre.textColor} text-lg md:text-xl tracking-tight z-10`}>
        {genre.name}
      </span>
    </div>
  );
};

export default GenreChip;
