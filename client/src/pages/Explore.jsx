import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrendingSongs } from '../redux/musicSlice';
import { usePlayer } from '../hooks/usePlayer';

import HeroBanner from '../components/explore/HeroBanner';
import SectionHeader from '../components/explore/SectionHeader';
import SongCard from '../components/explore/SongCard';
import PlaylistCard from '../components/explore/PlaylistCard';
import CompactTrackCard from '../components/explore/CompactTrackCard';
import { FiPlus } from 'react-icons/fi';

const Explore = () => {
  const dispatch = useDispatch();
  const { trending, loading, error } = useSelector((state) => state.music);
  const { playTrack } = usePlayer();

  useEffect(() => {
    dispatch(fetchTrendingSongs());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchTrendingSongs());
  };

  const renderSkeletons = (count = 6) => (
    Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="flex flex-col gap-3 animate-pulse min-w-[160px] md:min-w-[200px]">
        <div className="relative aspect-square rounded-2xl bg-surface-container shadow-lg" />
        <div>
          <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface-container rounded w-1/2" />
        </div>
      </div>
    ))
  );

  const renderCompactSkeletons = () => (
    Array.from({ length: 4 }).map((_, idx) => (
      <div key={idx} className="flex items-center gap-3 p-2 w-full animate-pulse">
        <div className="w-12 h-12 rounded bg-surface-container shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-surface-container rounded w-3/4 mb-2" />
          <div className="h-2 bg-surface-container rounded w-1/2" />
        </div>
      </div>
    ))
  );

  if (error) {
    return (
      <div className="bg-background min-h-screen text-on-surface flex flex-col items-center justify-center p-12 text-center pb-32">
        <div className="text-red-400 mb-6 text-xl">Failed to load Explore page data.</div>
        <button onClick={handleRetry} className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform shadow-xl">
          Retry Connection
        </button>
      </div>
    );
  }

  // Use the trending data for all sections since other endpoints fail due to YouTube quota
  const heroSong = trending?.length > 0 ? trending[0] : null;
  const recommendedData = trending?.length > 0 ? trending.slice(1, 5) : [];
  const newReleasesData = trending?.length > 0 ? trending.slice(5, 12) : [];
  const popularArtistsData = trending?.length > 0 ? trending.slice(12, 17) : [];

  console.log('--- EXPLORE DEBUG ---');
  console.log('state.music.loading:', loading);
  console.log('state.music.error:', error);
  console.log('state.music.trendingSongs:', trending);
  console.log('heroSong:', heroSong);
  console.log('---------------------');

  return (
    <div className="bg-background min-h-screen text-on-surface pb-32 animate-fade-in-up">
      <main className="max-w-[1800px] mx-auto px-6 md:px-10 pt-28 pb-8 relative z-10 space-y-16">
        
        {/* Top Section: Hero & Recommended Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className="xl:col-span-8">
            {loading && !heroSong ? (
               <div className="h-[550px] w-full rounded-3xl bg-surface-container animate-pulse mb-12 shadow-2xl" />
            ) : heroSong ? (
               <HeroBanner song={heroSong} onPlay={() => playTrack(heroSong, trending)} />
            ) : null}
          </div>
          <div className="xl:col-span-4">
            <h3 className="font-semibold text-xl text-on-surface mb-6">Recommended</h3>
            {loading && recommendedData.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                {renderCompactSkeletons()}
              </div>
            ) : recommendedData.length === 0 ? (
              <div className="text-on-surface-variant p-2">No songs found.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                {recommendedData.map(track => (
                  <div key={track.id} onClick={() => playTrack(track, trending)} className="cursor-pointer">
                    <CompactTrackCard track={{ ...track, image: track.thumbnail }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trending Songs Carousel */}
        <section>
          <SectionHeader title="Trending Now" showViewAll={true} onViewAll={() => {}} />
          <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-6 snap-x -mx-6 px-6 md:-mx-10 md:px-10">
            {loading && (!trending || trending.length === 0) ? renderSkeletons() : 
             !trending || trending.length === 0 ? (
              <div className="text-on-surface-variant p-4">No songs found.</div>
            ) : (
              trending.map(song => (
                <div key={song.videoId || song.id} className="flex-shrink-0 w-[130px] md:w-[155px] snap-start">
                  <SongCard 
                    song={song} 
                    onClick={() => playTrack(song, trending)} 
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* New Releases Carousel */}
        <section>
          <SectionHeader title="New Releases" showViewAll={true} onViewAll={() => {}} />
          <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-6 snap-x -mx-6 px-6 md:-mx-10 md:px-10">
            {loading && newReleasesData.length === 0 ? renderSkeletons() : 
             newReleasesData.length === 0 ? (
              <div className="text-on-surface-variant p-4">No songs found.</div>
            ) : (
              newReleasesData.map(song => (
                <div key={song.videoId || song.id} className="flex-shrink-0 w-[130px] md:w-[155px] snap-start">
                  <SongCard 
                    song={song} 
                    onClick={() => playTrack(song, trending)} 
                  />
                </div>
              ))
            )}
          </div>
        </section>

        {/* Popular Artists Grid (using trending data but rendering as playlists to fill the section) */}
        <section>
          <SectionHeader title="Popular Hits" showViewAll={true} onViewAll={() => {}} />
          {loading && popularArtistsData.length === 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-6">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="aspect-[3/4] md:aspect-[4/5] rounded-3xl bg-surface-container animate-pulse" />
              ))}
            </div>
          ) : popularArtistsData.length === 0 ? (
            <div className="text-on-surface-variant p-4">No songs found.</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-6">
              {popularArtistsData.map(song => (
                <div key={song.id} onClick={() => playTrack(song, trending)}>
                  <PlaylistCard 
                    playlist={{ 
                      id: song.id, 
                      image: song.thumbnail, 
                      title: song.artist, 
                      description: song.title 
                    }} 
                  />
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Floating Action Button (Mobile Fallback) */}
      <button className="md:hidden fixed bottom-28 right-6 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-transform z-40" style={{ background: 'linear-gradient(135deg, #842bd2 0%, #b76dff 100%)' }}>
        <FiPlus className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Explore;
