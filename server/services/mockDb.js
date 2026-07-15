const users = new Map();
const playlists = new Map();

module.exports = {
  getUser: (uid, decodedToken) => {
    if (!users.has(uid)) {
      users.set(uid, {
        _id: uid, // Use firebaseUid as mock internal _id
        firebaseUid: uid,
        name: decodedToken.name || decodedToken.displayName || 'Guest User',
        email: decodedToken.email || 'guest@example.com',
        photoURL: decodedToken.picture || null,
        likedSongs: [],
        likedPlaylists: [],
        savedPlaylists: [],
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {},
        save: async function() {
          users.set(this.firebaseUid, this);
          return this;
        }
      });
    }
    const u = users.get(uid);
    u.lastLogin = new Date();
    return u;
  },

  getUserByEmail: (email) => {
    return Array.from(users.values()).find(
      (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
    );
  },

  createUser: (userData) => {
    const uid = 'mock_user_' + Math.random().toString(36).substr(2, 9);
    const u = {
      _id: uid,
      firebaseUid: uid,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      photoURL: userData.photoURL || null,
      likedSongs: [],
      likedPlaylists: [],
      savedPlaylists: [],
      createdAt: new Date(),
      lastLogin: new Date(),
      save: async function() {
        users.set(this.firebaseUid, this);
        return this;
      }
    };
    users.set(uid, u);
    return u;
  },
  
  getPlaylists: (ownerId) => {
    return Array.from(playlists.values()).filter(p => p.owner.toString() === ownerId.toString());
  },
  
  getPlaylistById: (id) => {
    return playlists.get(id);
  },
  
  createPlaylist: (ownerId, playlistData) => {
    const id = 'mock_playlist_' + Math.random().toString(36).substr(2, 9);
    const p = {
      _id: id,
      owner: ownerId,
      title: playlistData.title,
      description: playlistData.description || '',
      coverImage: playlistData.coverImage || '',
      genre: playlistData.genre || '',
      privacy: playlistData.privacy || 'Public',
      tags: playlistData.tags || [],
      playlistType: playlistData.playlistType || 'manual',
      isAIGenerated: playlistData.isAIGenerated || (playlistData.playlistType === 'ai') || false,
      generatedBy: playlistData.generatedBy || '',
      likes: 0,
      likedBy: [],
      saveCount: 0,
      savedBy: [],
      playCount: 0,
      shareCount: 0,
      songs: playlistData.songs || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      save: async function() {
        playlists.set(this._id, this);
        return this;
      },
      deleteOne: async function() {
        playlists.delete(this._id);
        return { deletedCount: 1 };
      }
    };
    playlists.set(id, p);
    return p;
  }
};
