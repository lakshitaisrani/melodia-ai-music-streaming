import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Clock } from 'lucide-react';
import { 
  fetchPlaylistDetails, 
  clearCurrentPlaylist, 
  removeSongFromPlaylist, 
  togglePlaylistLike, 
  togglePlaylistSave,
  incrementShareCount,
  incrementPlayCount,
  deletePlaylist,
  fetchLikedPlaylists
} from '../redux/playlistSlice';
import { likeSong, unlikeSong, fetchLikedSongs } from '../redux/librarySlice';
import { usePlayer } from '../hooks/usePlayer';
import { useToast } from '../context/ToastContext';
import PlaylistHeader from '../components/playlist/PlaylistHeader';
import PlaylistSongRow from '../components/playlist/PlaylistSongRow';
import PlaylistSidebar from '../components/playlist/PlaylistSidebar';
import EditPlaylistModal from '../components/playlist/EditPlaylistModal';

const Playlist = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const { currentPlaylist, currentLoading, error, likedPlaylists, savedPlaylists } = useSelector(state => state.playlist);
  const { currentUser } = useSelector(state => state.auth);
  const { likedSongs } = useSelector(state => state.library);
  const { playTrack, toggleShuffle, shuffle: isPlayerShuffle, currentTrack } = usePlayer();
  
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [shuffledSongs, setShuffledSongs] = useState([]);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);

  // Fisher-Yates local shuffle sync
  useEffect(() => {
    const songs = currentPlaylist?.songs || [];
    if (isPlayerShuffle && songs.length > 0) {
      const currentId = currentTrack?.id || currentTrack?.videoId;
      const currentTrackObj = songs.find(s => s.videoId === currentId);
      
      let otherSongs = songs.filter(s => s.videoId !== currentId);
      for (let i = otherSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherSongs[i], otherSongs[j]] = [otherSongs[j], otherSongs[i]];
      }
      
      const mappedOtherSongs = otherSongs.map(s => ({
        id: s.videoId,
        title: s.title,
        artist: s.artist,
        album: '',
        duration: s.duration || '',
        image: s.thumbnail,
        videoId: s.videoId
      }));

      const mappedCurrentTrack = currentTrackObj ? {
        id: currentTrackObj.videoId,
        title: currentTrackObj.title,
        artist: currentTrackObj.artist,
        album: '',
        duration: currentTrackObj.duration || '',
        image: currentTrackObj.thumbnail,
        videoId: currentTrackObj.videoId
      } : null;

      if (mappedCurrentTrack) {
        setShuffledSongs([mappedCurrentTrack, ...mappedOtherSongs]);
      } else {
        setShuffledSongs(mappedOtherSongs);
      }
    } else {
      setShuffledSongs([]);
    }
  }, [isPlayerShuffle, currentPlaylist, currentTrack]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPlaylistDetails(id));
      dispatch(fetchLikedPlaylists());
      dispatch(fetchLikedSongs());
    }
    return () => {
      dispatch(clearCurrentPlaylist());
    };
  }, [dispatch, id]);

  if (currentLoading || !currentPlaylist) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-on-surface-variant animate-pulse font-bold">Loading playlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-grow flex items-center justify-center min-h-screen">
        <div className="text-red-400 font-mono text-sm">Error: {error}</div>
      </div>
    );
  }

  // Calculate if current user is owner of the playlist
  const isOwner = currentUser && (
    currentPlaylist.owner?._id === currentUser.uid ||
    currentPlaylist.owner === currentUser.uid ||
    currentPlaylist.owner?.firebaseUid === currentUser.uid
  );

  // Map the backend fields to what the UI components expect (mock format)
  const mappedPlaylist = {
    id: currentPlaylist._id,
    title: currentPlaylist.title,
    description: currentPlaylist.description,
    creator: currentPlaylist.owner?.name || 'Unknown',
    createdDate: new Date(currentPlaylist.createdAt).toISOString().split('T')[0],
    songCount: currentPlaylist.songs.length,
    duration: 'Various',
    image: currentPlaylist.coverImage || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=500',
    genres: currentPlaylist.genre ? [currentPlaylist.genre] : [],
    genre: currentPlaylist.genre || '',
    privacy: currentPlaylist.privacy || 'Public',
    tags: currentPlaylist.tags || [],
    playlistType: currentPlaylist.playlistType || 'manual',
    stats: {
      likes: currentPlaylist.likes || 0,
      saves: currentPlaylist.saveCount || 0,
      plays: currentPlaylist.playCount || 0,
      shares: currentPlaylist.shareCount || 0
    },
    songs: currentPlaylist.songs.map(s => ({
      id: s.videoId,
      title: s.title,
      artist: s.artist,
      album: '',
      duration: s.duration || '',
      image: s.thumbnail,
      videoId: s.videoId
    }))
  };

  const displaySongs = isPlayerShuffle && shuffledSongs.length > 0 ? shuffledSongs : mappedPlaylist.songs;
  
  const isPlaylistLiked = currentPlaylist && currentPlaylist.likedBy && currentUser && (
    currentPlaylist.likedBy.includes(currentUser.uid) ||
    currentPlaylist.likedBy.includes(currentUser._id) ||
    currentPlaylist.likedBy.some(id => {
      const idStr = id._id || id;
      return idStr === currentUser.uid || idStr === currentUser._id;
    })
  );

  const isPlaylistSaved = currentPlaylist && currentPlaylist.savedBy && currentUser && (
    currentPlaylist.savedBy.includes(currentUser.uid) ||
    currentPlaylist.savedBy.includes(currentUser._id) ||
    currentPlaylist.savedBy.some(id => {
      const idStr = id._id || id;
      return idStr === currentUser.uid || idStr === currentUser._id;
    })
  );

  const handlePlaySong = (song) => {
    playTrack(song, displaySongs);
  };

  const handleRemoveSong = async (videoId) => {
    try {
      await dispatch(removeSongFromPlaylist({ id: currentPlaylist._id, videoId })).unwrap();
      showToast('Song removed');
    } catch (err) {
      showToast('Failed to remove song', 'error');
    }
  };

  const handlePlayPlaylist = () => {
    if (displaySongs.length > 0) {
      playTrack(displaySongs[0], displaySongs);
    } else {
      showToast('Playlist is empty', 'error');
    }
  };

  const handleShuffleToggle = () => {
    toggleShuffle();
  };

  const handleLikePlaylist = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      await dispatch(togglePlaylistLike({ 
        id: currentPlaylist._id, 
        userId: currentUser?._id || currentUser?.uid, 
        isLiked: isPlaylistLiked 
      })).unwrap();
      showToast(isPlaylistLiked ? 'Removed from liked playlists' : 'Added to liked playlists');
    } catch (err) {
      showToast('Couldn\'t update like. Please try again.', 'error');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleSavePlaylist = async () => {
    if (isSaveLoading) return;
    setIsSaveLoading(true);
    try {
      await dispatch(togglePlaylistSave({ 
        id: currentPlaylist._id, 
        userId: currentUser?._id || currentUser?.uid, 
        isSaved: isPlaylistSaved 
      })).unwrap();
      showToast(isPlaylistSaved ? 'Removed from saved collection' : 'Saved to collection');
    } catch (err) {
      showToast('Couldn\'t update saved playlist. Please try again.', 'error');
    } finally {
      setIsSaveLoading(false);
    }
  };

  const handleSharePlaylist = () => {
    const playlistUrl = window.location.href;
    dispatch(incrementShareCount(currentPlaylist._id));
    if (navigator.share) {
      navigator.share({
        title: mappedPlaylist.title,
        text: mappedPlaylist.description,
        url: playlistUrl,
      })
      .catch((e) => console.log('Share canceled', e));
    } else {
      navigator.clipboard.writeText(playlistUrl)
        .then(() => showToast('Playlist link copied.'))
        .catch(() => showToast('Failed to copy link', 'error'));
    }
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm("Delete this playlist permanently?")) {
      try {
        await dispatch(deletePlaylist(currentPlaylist._id)).unwrap();
        showToast('Playlist deleted');
        navigate('/library');
      } catch (err) {
        showToast('Failed to delete playlist', 'error');
      }
    }
  };

  const handleSaveSuccess = () => {
    showToast('Playlist updated');
    dispatch(fetchPlaylistDetails(id));
  };

  const handleLikeSong = async (song) => {
    const songId = song.videoId || song.id;
    const isSongLiked = likedSongs?.some(s => s.videoId === songId);
    try {
      if (isSongLiked) {
        await dispatch(unlikeSong(songId)).unwrap();
        showToast('Song removed from Liked Songs');
      } else {
        await dispatch(likeSong({
          videoId: songId,
          title: song.title,
          artist: song.artist,
          thumbnail: song.image,
          duration: song.duration || '0:00'
        })).unwrap();
        showToast('Song added to Liked Songs');
      }
    } catch (err) {
      showToast('Failed to toggle song like', 'error');
    }
  };

  return (
    <main className="flex-grow overflow-y-auto relative pb-32">
      <PlaylistHeader 
        playlist={mappedPlaylist}
        onPlay={handlePlayPlaylist}
        onShuffle={handleShuffleToggle}
        onLike={handleLikePlaylist}
        onSave={handleSavePlaylist}
        onShare={handleSharePlaylist}
        onEdit={() => setIsEditOpen(true)}
        onDelete={handleDeletePlaylist}
        isLiked={isPlaylistLiked}
        isSaved={isPlaylistSaved}
        isLikeLoading={isLikeLoading}
        isSaveLoading={isSaveLoading}
        isShuffled={isPlayerShuffle}
        isOwner={isOwner}
      />
      
      <div className="px-6 md:px-12 lg:px-24 py-8 flex flex-col xl:flex-row gap-12">
        {/* Main Content: Songs Table */}
        <div className="flex-grow flex flex-col min-w-0">
          
          {/* Table Header */}
          <div className="flex items-center gap-4 px-3 py-2 border-b border-white/10 text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-4">
            <div className="w-8 text-center flex-shrink-0">#</div>
            <div className="w-10 flex-shrink-0"></div>
            <div className="flex-grow min-w-0 md:w-1/3">Title</div>
            <div className="hidden md:block flex-grow min-w-0 md:w-1/4">Album</div>
            <div className="hidden sm:block w-16 text-right">
              <Clock className="w-4 h-4 ml-auto" />
            </div>
            <div className="w-24"></div>
          </div>
          
          {/* Songs List */}
          <div className="flex flex-col">
            {displaySongs.length === 0 ? (
              <div className="text-on-surface-variant p-4 text-center mt-12">
                This playlist is currently empty.
              </div>
            ) : (
              displaySongs.map((song, index) => {
                const songId = song.videoId || song.id;
                const isSongLiked = likedSongs?.some(s => s.videoId === songId);
                return (
                  <div key={songId} onClick={() => handlePlaySong(song)}>
                    <PlaylistSongRow 
                      song={song} 
                      index={index} 
                      onRemove={() => handleRemoveSong(songId)}
                      isOwner={isOwner}
                      isLiked={isSongLiked}
                      onLike={() => handleLikeSong(song)}
                    />
                  </div>
                );
              })
            )}
          </div>
          
        </div>

        {/* Sidebar */}
        <PlaylistSidebar playlist={mappedPlaylist} similarPlaylists={[]} />
      </div>

      {/* Edit Details Modal */}
      <EditPlaylistModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        playlist={mappedPlaylist} 
        onSaveSuccess={handleSaveSuccess}
      />
    </main>
  );
};

export default Playlist;
