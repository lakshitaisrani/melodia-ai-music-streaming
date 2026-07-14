import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Plus, Check } from 'lucide-react';
import { mockTrendingSongs } from '../../data/mockData';
import { fetchSearchResults, clearSearchResults } from '../../redux/searchSlice';

const SongSelector = ({ selectedSongs, onSelect, onDeselect }) => {
  const dispatch = useDispatch();
  const { results, loading, error } = useSelector((state) => state.search);
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce search input to match application's search behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm && searchTerm.trim().length >= 2) {
        dispatch(fetchSearchResults(searchTerm));
      } else {
        dispatch(clearSearchResults());
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, dispatch]);

  // Clean up search results when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  const isSelected = (id) => selectedSongs.some(song => (song.id === id || song.videoId === id));

  // Determine what list of songs to display
  const songsToDisplay = searchTerm.trim().length >= 2 ? results : mockTrendingSongs;

  return (
    <div className="flex flex-col h-full bg-surface-container rounded-2xl border border-white/5 overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 bg-surface-container-low">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search for songs or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Song List */}
      <div className="flex-grow overflow-y-auto p-2 max-h-[300px] xl:max-h-full custom-scrollbar">
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-3 p-2">
                <div className="w-10 h-10 bg-white/5 rounded-md flex-shrink-0"></div>
                <div className="flex-grow">
                  <div className="h-3.5 bg-white/5 rounded w-2/3 mb-2"></div>
                  <div className="h-2.5 bg-white/5 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-32 text-error text-xs font-mono p-4 text-center">
            {error}
          </div>
        ) : songsToDisplay.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-on-surface-variant text-sm">
            No results found.
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {songsToDisplay.map(song => {
              const id = song.id || song.videoId;
              const image = song.thumbnail || song.image;
              const artist = song.artist || song.channelTitle || 'Unknown Artist';
              const selected = isSelected(id);
              return (
                <div key={id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                  <img src={image} alt={song.title} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                  <div className="flex-grow min-w-0">
                    <h6 className="text-sm font-bold text-on-surface truncate">{song.title}</h6>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="truncate">{artist}</span>
                      {song.duration && (
                        <>
                          <span>•</span>
                          <span>{song.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => selected ? onDeselect(id) : onSelect(song)}
                    className={`p-2 rounded-full transition-all ${
                      selected 
                        ? 'bg-primary/20 text-primary border border-primary/50' 
                        : 'bg-white/5 text-on-surface-variant hover:bg-white/10 hover:text-white border border-transparent'
                    }`}
                    aria-label={selected ? "Remove song" : "Add song"}
                  >
                    {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SongSelector;
