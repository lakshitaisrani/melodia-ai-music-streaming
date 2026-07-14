import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Heart } from 'lucide-react';
import { fetchTrendingSongs } from '../../redux/musicSlice';
import { likeSong, unlikeSong } from '../../redux/librarySlice';
import { usePlayer } from '../../hooks/usePlayer';
import useScrollAnimation from '../../hooks/useScrollAnimation';

/**
 * Trending Songs Preview Section
 * 6-song grid with gradient cover placeholders.
 * Each card has hover play overlay + like interaction.
 */
const TrendingSection = () => {
  const dispatch = useDispatch();
  const { trending, loading, error } = useSelector((state) => state.music);
  const { playTrack } = usePlayer();
  
  // Re-run scroll observer when trending data populates so dynamic cards animate in
  useScrollAnimation('.animate-on-scroll', {}, [trending]);

  useEffect(() => {
    dispatch(fetchTrendingSongs());
  }, [dispatch]);

  const renderSkeletons = () => (
    Array.from({ length: 6 }).map((_, idx) => (
      <div key={idx} className="flex flex-col gap-3 animate-pulse">
        <div className="relative aspect-square rounded-2xl bg-surface-container shadow-lg" />
        <div>
          <div className="h-4 bg-surface-container rounded w-3/4 mb-2" />
          <div className="h-3 bg-surface-container rounded w-1/2" />
        </div>
      </div>
    ))
  );

  return (
    <section id="trending" className="section-padding">
      <div className="container-melodia">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 animate-on-scroll">
          <div>
            <span className="font-mono text-label-md uppercase tracking-widest text-tertiary mb-1 block">
              Charts
            </span>
            <h2 className="text-headline-lg font-extrabold text-on-surface">Trending Now</h2>
            <p className="text-body-md text-on-surface-variant mt-1">
              The hottest tracks across the globe right now.
            </p>
          </div>
          <button
            onClick={() => dispatch(fetchTrendingSongs())}
            className="shrink-0 text-primary font-bold text-body-md hover:text-primary-fixed transition-colors underline underline-offset-4 decoration-primary/40 hover:decoration-primary"
            aria-label="View global charts"
          >
            View Global Charts →
          </button>
        </div>

        {/* Song grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {loading && renderSkeletons()}
          {error && <div className="col-span-full text-red-400 p-4 text-center">Error: {error}</div>}
          {!loading && !error && trending.length === 0 && <div className="col-span-full text-on-surface-variant p-4 text-center">No trending songs found.</div>}
          {!loading && !error && trending.slice(0, 6).map((song, idx) => (
            <SongCard key={song.id || idx} song={song} index={idx} onPlay={() => playTrack(song, trending)} />
          ))}
        </div>
      </div>
    </section>
  );
};

/** Individual song card with play overlay and like button */
const SongCard = ({ song, index, onPlay }) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.library);
  const { user } = useSelector((state) => state.auth);

  const videoId = song.id || song.videoId;
  const liked = likedSongs?.some((s) => s.videoId === videoId);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!user) return; // Must be logged in

    if (liked) {
      dispatch(unlikeSong(videoId));
    } else {
      dispatch(
        likeSong({
          videoId,
          title: song.title,
          artist: song.artist || song.channelTitle || 'Unknown Artist',
          thumbnail: song.thumbnail || song.image,
          duration: song.duration || '0:00',
        })
      );
    }
  };

  return (
    <div
      className="group flex flex-col gap-3 animate-on-scroll cursor-pointer"
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={onPlay}
    >
      {/* Cover art */}
      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-surface-container shadow-lg">
        {song.thumbnail ? (
          <img src={song.thumbnail} alt={song.title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-90" aria-hidden="true" />
        )}
        
        {/* Song genre overlay (if available) */}
        {song.genre && (
          <div className="absolute inset-0 flex items-end justify-start p-3">
            <span
              className="text-xs font-mono font-bold text-white/60 uppercase tracking-wider"
            >
              {song.genre}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300"
            aria-label={`Play ${song.title}`}
            onClick={(e) => { e.stopPropagation(); onPlay(); }}
          >
            <Play size={20} fill="currentColor" />
          </button>
        </div>

        {/* Like button — visible on hover */}
        <button
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 ${
            liked
              ? 'bg-primary/20 text-primary'
              : 'bg-black/40 text-white/70 hover:text-primary hover:bg-primary/20'
          }`}
          onClick={handleLike}
          aria-label={liked ? 'Unlike' : 'Like'}
          aria-pressed={liked}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Metadata */}
      <div>
        <h4 className="font-bold text-on-surface text-sm truncate group-hover:text-primary transition-colors duration-200" title={song.title}>
          {song.title}
        </h4>
        <p className="font-mono text-label-sm text-on-surface-variant truncate" title={song.artist}>{song.artist}</p>
      </div>
    </div>
  );
};

export default TrendingSection;

