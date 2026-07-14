import { Play, Heart, PlusCircle, ListPlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { likeSong, unlikeSong } from '../../redux/librarySlice';
import { addToQueue } from '../../redux/playerSlice';
import { useState } from 'react';
import AddToPlaylistModal from '../library/AddToPlaylistModal';

const SongCard = ({ song, onClick, isActive }) => {
  const dispatch = useDispatch();
  const { likedSongs } = useSelector((state) => state.library);
  const { currentUser } = useSelector((state) => state.auth);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const videoId = song.id || song.videoId;
  const isLiked = likedSongs?.some((s) => s.videoId === videoId);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!currentUser) return; // Must be logged in

    if (isLiked) {
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

  const handleAddToPlaylist = (e) => {
    e.stopPropagation();
    if (!currentUser) return;
    setShowPlaylistModal(true);
  };

  return (
    <>
      <div className={`w-full group cursor-pointer premium-glow-card ${isActive ? 'bg-white/10 p-2 -mx-2 rounded-2xl' : ''}`} onClick={onClick}>
        <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/10 transition-all">
          <img 
            src={song.thumbnail || song.image} 
            alt={song.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
            <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-on-primary transition-all shadow-xl hover:scale-105 active:scale-95 translate-y-4 group-hover:translate-y-0 duration-300">
              <Play className="w-6 h-6 ml-1" fill="currentColor" />
            </button>
          </div>
        </div>
        <div className="px-1">
          <h4 className={`font-bold truncate text-base mb-0.5 transition-colors ${isActive ? 'text-primary' : 'text-white group-hover:text-primary'}`}>{song.title}</h4>
          <div className="flex items-center justify-between text-on-surface-variant text-sm">
            <p className="truncate flex-1 pr-2">{song.artist}</p>
            <div className="flex items-center gap-1">
              <button 
                onClick={handleLike}
                className={`opacity-0 group-hover:opacity-100 hover:text-white transition-all transform hover:scale-110 active:scale-95 ${isLiked ? 'text-primary opacity-100' : ''}`}
              >
                <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(addToQueue({
                    id: videoId,
                    videoId,
                    title: song.title,
                    artist: song.artist || song.channelTitle || 'Unknown Artist',
                    thumbnail: song.thumbnail || song.image,
                    duration: song.duration || '0:00'
                  }));
                }}
                className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all transform hover:scale-110 active:scale-95"
                title="Add to Queue"
              >
                <ListPlus className="w-4 h-4" />
              </button>
              <button 
                onClick={handleAddToPlaylist}
                className="opacity-0 group-hover:opacity-100 text-on-surface-variant hover:text-primary transition-all transform hover:scale-110 active:scale-95"
                title="Add to Playlist"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AddToPlaylistModal 
        isOpen={showPlaylistModal} 
        onClose={() => setShowPlaylistModal(false)}
        song={{
          videoId,
          title: song.title,
          artist: song.artist || song.channelTitle || 'Unknown Artist',
          thumbnail: song.thumbnail || song.image,
          duration: song.duration
        }}
      />
    </>
  );
};

export default SongCard;
