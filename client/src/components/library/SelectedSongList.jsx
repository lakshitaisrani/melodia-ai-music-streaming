import { X } from 'lucide-react';

const SelectedSongList = ({ songs, onRemove }) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-xl bg-surface-container-low/50">
        <p className="text-sm text-on-surface-variant text-center">No songs selected yet.</p>
        <p className="text-xs text-on-surface-variant/60 text-center mt-1">Search and add songs below.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
      {songs.map(song => {
        const id = song.id || song.videoId;
        const image = song.thumbnail || song.image;
        const artist = song.artist || song.channelTitle || 'Unknown Artist';
        return (
          <div key={id} className="flex items-center gap-3 p-2 rounded-xl bg-surface-container border border-white/5 group hover:border-white/10 transition-colors">
            <img src={image} alt={song.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
            <div className="flex-grow min-w-0">
              <h6 className="text-sm font-bold text-on-surface truncate">{song.title}</h6>
              <p className="text-xs text-on-surface-variant truncate">{artist}</p>
            </div>
            <button 
              onClick={() => onRemove(id)}
              className="p-2 text-on-surface-variant hover:text-error transition-colors rounded-full hover:bg-error/10"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SelectedSongList;
