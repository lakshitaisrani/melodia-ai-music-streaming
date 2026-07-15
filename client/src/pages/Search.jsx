import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, X, Mic } from 'lucide-react';
import { fetchSearchResults, setSearchQuery, clearSearchResults } from '../redux/searchSlice';
import { usePlayer } from '../hooks/usePlayer';
import SongCard from '../components/explore/SongCard';

const Search = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const { query, results, loading, error } = useSelector((state) => state.search);
  const { currentTrack, playTrack } = usePlayer();
  const [localQuery, setLocalQuery] = useState(urlQuery || query || '');
  const [activeGenre, setActiveGenre] = useState(searchParams.get('genre') || '');
  const [isFocused, setIsFocused] = useState(false);

  // Sync with URL query on mount/change
  useEffect(() => {
    if (urlQuery && urlQuery !== localQuery) {
      setLocalQuery(urlQuery);
    }
  }, [urlQuery]);

  // Debounce logic & search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchQuery(localQuery || ''));
      if ((localQuery && localQuery.trim().length >= 2) || activeGenre) {
        const params = {};
        if (localQuery) params.q = localQuery;
        if (activeGenre) params.genre = activeGenre;
        setSearchParams(params);
        dispatch(fetchSearchResults({ query: localQuery, genre: activeGenre }));
      } else {
        setSearchParams({});
        dispatch(clearSearchResults());
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localQuery, activeGenre, dispatch, setSearchParams]);

  const handleClear = () => {
    setLocalQuery('');
    setActiveGenre('');
    dispatch(setSearchQuery(''));
    dispatch(clearSearchResults());
  };

  return (
    <div className="bg-background min-h-screen text-on-surface pb-32 relative z-10 pt-20 animate-fade-in-up">
      <main className="flex-grow overflow-y-auto relative z-10">
      <header className="relative px-6 md:px-12 lg:px-24 py-16 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
          <h2 className="font-headline-lg text-4xl md:text-5xl font-bold text-on-surface mb-4">Search Music</h2>
          <p className="text-lg text-on-surface-variant max-w-xl mx-auto md:mx-0">Find your favorite songs, artists, albums, and playlists instantly.</p>
        </div>
        
        <div className="mt-12 relative z-[60] max-w-3xl mx-auto pointer-events-auto">
          <div className={`relative z-[60] flex items-center px-6 py-4 rounded-2xl border transition-all duration-300 shadow-xl backdrop-blur-xl pointer-events-auto ${isFocused ? 'bg-primary/10 border-primary/50 shadow-primary/20' : 'bg-surface-container/60 border-white/10 shadow-black/40'}`}>
            <SearchIcon className={`w-6 h-6 transition-colors ${isFocused ? 'text-primary' : 'text-on-surface-variant'}`} />
            <input 
              type="text"
              value={localQuery}
              onChange={(e) => {
                console.log("onChange called with value:", e.target.value);
                setLocalQuery(e.target.value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search songs, artists, albums, genres..."
              className="relative z-[60] pointer-events-auto bg-transparent border-none outline-none focus:ring-0 flex-1 px-4 text-lg text-on-surface placeholder:text-on-surface-variant/50"
            />
            {localQuery && (
              <button onClick={handleClear} className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-surface-variant mr-2">
                <X className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-on-surface-variant">
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 lg:px-24 flex flex-col xl:flex-row gap-8 pb-12">
        <aside className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-8">
          <section>
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Genre</h4>
            <div className="flex flex-wrap gap-2">
              {['Pop', 'Rock', 'Hip-Hop', 'EDM', 'Jazz'].map((genre) => {
                const isActive = activeGenre === genre.toLowerCase();
                return (
                  <button 
                    key={genre} 
                    onClick={() => setActiveGenre(isActive ? '' : genre.toLowerCase())}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-primary/20 border border-primary/30 text-primary' : 'bg-surface-container border border-white/5 text-on-surface-variant hover:bg-white/10'}`}>
                    {genre}
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <div className="flex-grow flex flex-col gap-12">
          {/* Main Content Area */}
          {(!localQuery || localQuery.trim().length < 2) && !activeGenre ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
              <SearchIcon className="w-16 h-16 text-on-surface-variant mb-6" />
              <h3 className="text-2xl font-bold text-on-surface mb-2">Search for songs, artists or albums</h3>
              <p className="text-on-surface-variant">Type at least 2 characters to see live results</p>
            </div>
          ) : loading ? (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-surface-container rounded-xl aspect-[3/4] w-full"></div>
                ))}
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <h3 className="text-2xl font-bold text-error mb-2">Oops!</h3>
              <p className="text-on-surface-variant mb-6">{error}</p>
              <button onClick={() => dispatch(fetchSearchResults(localQuery))} className="px-6 py-2 bg-primary text-on-primary font-bold rounded-full hover:bg-primary-dark">Retry</button>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
              <h3 className="text-2xl font-bold text-on-surface mb-2">No results found</h3>
              <p className="text-on-surface-variant">Try searching for something else.</p>
            </div>
          ) : (
             <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
                {results.map((song) => (
                   <SongCard 
                     key={song.id} 
                     song={{ ...song, image: song.thumbnail }} 
                     isActive={currentTrack?.id === song.id}
                     onClick={() => playTrack(song, results)} 
                   />
                ))}
             </div>
          )}
        </div>
      </div>
    </main>
    </div>
  );
};

export default Search;
