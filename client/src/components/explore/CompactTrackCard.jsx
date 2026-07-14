import { Play } from 'lucide-react';
import { FiMoreHorizontal } from 'react-icons/fi';

const CompactTrackCard = ({ track }) => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-container transition-colors group cursor-pointer w-full">
      <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 shadow-sm">
        <img src={track.image} alt={track.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="w-5 h-5 text-white" fill="currentColor" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
          {track.title}
        </h4>
        <p className="text-xs text-on-surface-variant truncate">
          {track.artist}
        </p>
      </div>
      <button className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-white transition-all p-2">
        <FiMoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default CompactTrackCard;
