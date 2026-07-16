import { useState, useEffect } from 'react';
import { Plus, Sparkles, Heart, ListMusic, Music2, ArrowRight, Download, Bookmark, Trash2, Play } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { BiLoaderAlt } from 'react-icons/bi';
import LibraryTabs from '../components/library/LibraryTabs';
import CreatePlaylistModal from '../components/library/CreatePlaylistModal';
import GenerateSmartPlaylistModal from '../components/library/GenerateSmartPlaylistModal';
import SongRow from '../components/common/SongRow';
import PlaylistCard from '../components/explore/PlaylistCard';
import { fetchLikedSongs } from '../redux/librarySlice';
import { fetchMyPlaylists, generateDiscoverWeekly, togglePlaylistLike, togglePlaylistSave, deletePlaylist } from '../redux/playlistSlice';
import { usePlayer } from '../hooks/usePlayer';
import { useToast } from '../context/ToastContext';



const Library = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { likedSongs, loading: libraryLoading } = useSelector(state => state.library);
  const { playlists, loading: playlistsLoading, error: playlistsError } = useSelector(state => state.playlist);

  const { user } = useSelector(state => state.auth);
  const { playTrack } = usePlayer();



  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('liked');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDiscoverWeeklyClick = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const playlist = await dispatch(generateDiscoverWeekly()).unwrap();
      showToast("Your Discover Weekly is ready!");
      
      if (playlist && playlist.songs && playlist.songs.length > 0) {
        const songs = playlist.songs.map(s => ({
          id: s.videoId,
          title: s.title,
          artist: s.artist,
          album: '',
          duration: s.duration || '',
          image: s.thumbnail,
          videoId: s.videoId
        }));
        playTrack(songs[0], songs);
      }
      
      navigate(`/playlist/${playlist._id}`);
    } catch (err) {
      showToast(err || "Failed to generate Discover Weekly", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (tabParam === 'liked' || tabParam === 'playlists') {
      setActiveTab(tabParam);
    } else if (tabParam) {
      setActiveTab('playlists'); // Fallback for removed tabs
    }
  }, [tabParam]);

  useEffect(() => {
    if (user) {
      dispatch(fetchLikedSongs());
      dispatch(fetchMyPlaylists());
    }
  }, [dispatch, user]);

  // Quick Stats
  const stats = [
    { id: 1, title: 'Liked Songs', count: likedSongs?.length || 0, icon: Heart, color: 'text-primary', bg: 'bg-primary/10' },
    { id: 2, title: 'My Playlists', count: playlists?.length || 0, icon: ListMusic, color: 'text-secondary', bg: 'bg-secondary/10' },
  ];

  const handlePlayLikedSong = (song) => {
    playTrack(song, likedSongs);
  };

  return (
    <main className="flex-grow overflow-y-auto relative pb-32 animate-fade-in-up">
      <div className="px-6 md:px-12 lg:px-24 pt-28">
        
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-headline-lg text-4xl md:text-5xl font-bold text-on-surface">My Library</h2>
            <p className="text-on-surface-variant text-lg mt-3">Your personal music collection, playlists, and AI recommendations.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-full border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 font-bold text-sm text-on-surface hover:border-primary/50"
            >
              <Plus className="w-5 h-5" />
              Create Playlist
            </button>
            <button 
              onClick={() => setIsSmartModalOpen(true)}
              className="px-6 py-3 rounded-full bg-primary text-on-primary shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2 font-bold text-sm hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-5 h-5" fill="currentColor" />
              Generate Smart Playlist
            </button>
          </div>
        </section>

        {/* Stats Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map(stat => (
            <div key={stat.id} className="bg-surface-container/60 p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group hover:bg-surface-container-high h-44 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <h4 className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</h4>
              </div>
              <p className="text-3xl font-extrabold text-on-surface leading-none">{stat.count}</p>
            </div>
          ))}
          <div 
            onClick={handleDiscoverWeeklyClick}
            className={`bg-gradient-to-br from-primary-container to-secondary-container p-6 rounded-3xl border border-white/10 relative overflow-hidden group h-44 flex flex-col justify-between transition-all ${
              isGenerating ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
            }`}
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/20 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            <div>
              <h4 className="text-on-primary-container font-extrabold text-lg mb-1 leading-tight">Discover Weekly</h4>
              <p className="text-on-primary-container/80 text-xs">
                {isGenerating ? 'Curating your fresh weekly mixtape...' : 'New music curated for you.'}
              </p>
            </div>
            {isGenerating ? (
              <div className="relative z-10 flex items-center gap-2 text-on-primary-container font-bold text-sm mt-auto">
                <BiLoaderAlt className="animate-spin w-4 h-4 text-on-primary-container" />
                <span className="animate-pulse">Generating your Discover Weekly...</span>
              </div>
            ) : (
              <div className="relative z-10 flex items-center gap-1.5 text-on-primary-container font-bold text-sm group-hover:translate-x-1.5 transition-transform mt-auto">
                <span>Listen Now</span>
                <ArrowRight size={16} />
              </div>
            )}
          </div>
        </section>

        {/* Tabs & Content */}
        <section>
          <LibraryTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-8">
            {activeTab === 'liked' && (
              <div className="flex flex-col gap-1">
                {libraryLoading ? (
                  <div className="text-on-surface-variant p-4">Loading liked songs...</div>
                ) : likedSongs?.length > 0 ? (
                  likedSongs.map((song, idx) => (
                    <SongRow key={song.videoId || idx} song={song} index={idx} onClick={() => handlePlayLikedSong(song)} />
                  ))
                ) : (
                  <div className="text-on-surface-variant p-4 text-center py-12">
                    <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven't liked any songs yet.</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'playlists' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playlistsLoading ? (
                  <div className="text-on-surface-variant p-4 col-span-full">Loading playlists...</div>
                ) : playlists?.length > 0 ? (
                  playlists.map((playlist) => (
                    <Link to={`/playlist/${playlist._id}`} key={playlist._id}>
                      <PlaylistCard playlist={{ 
                        id: playlist._id, 
                        title: playlist.title, 
                        description: playlist.description, 
                        image: playlist.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500',
                        playlistType: playlist.playlistType
                      }} />
                    </Link>
                  ))
                ) : (
                  <div className="text-on-surface-variant p-4 text-center py-12 col-span-full">
                    <ListMusic className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>You haven't created any playlists yet.</p>
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="mt-4 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors"
                    >
                      Create your first playlist
                    </button>
                  </div>
                )}
              </div>
            )}



          </div>
        </section>
        
      </div>

      {/* Modal */}
      <CreatePlaylistModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <GenerateSmartPlaylistModal 
        isOpen={isSmartModalOpen} 
        onClose={() => setIsSmartModalOpen(false)} 
      />
    </main>
  );
};

export default Library;
