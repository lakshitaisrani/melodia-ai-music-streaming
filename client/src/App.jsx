import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastProvider } from './context/ToastContext';
import { setUser, clearUser } from './redux/authSlice';
import { fetchLikedSongs } from './redux/librarySlice';
import { fetchMyPlaylists } from './redux/playlistSlice';
import apiClient from './services/apiClient';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Explore from './pages/Explore';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import BottomPlayer from './components/layout/BottomPlayer';
import SideNavBar from './components/layout/SideNavBar';
import ProtectedRoute from './components/auth/ProtectedRoute';

// ── Placeholder for pages not yet implemented ─────────────────────────────────
const PlaceholderPage = ({ name }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="glass-panel rounded-3xl px-10 py-14 text-center max-w-md mx-4">
      <div className="text-5xl mb-4">🎵</div>
      <h1 className="text-2xl font-bold text-on-surface mb-2">{name}</h1>
      <p className="text-sm text-on-surface-variant">
        This page is coming soon. We're building it next!
      </p>
    </div>
  </div>
);

/**
 * AUTH_ROUTES — pages that have their own full-screen layout
 * and should NOT show the shared Navbar + Footer.
 */
const AUTH_ROUTES = ['/login', '/signup'];

/**
 * AppShell
 * Conditionally renders Navbar + Footer only on non-auth routes.
 * Must be inside <Router> to access useLocation.
 */
const AppShell = () => {
  const { pathname } = useLocation();
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = !isAuthRoute && pathname !== '/';

  return (
    <div className={`relative flex flex-col min-h-screen ${isProtectedRoute ? 'pb-32' : ''}`}>
      {/* Global mesh background */}
      {!isAuthRoute && <div className="mesh-bg" aria-hidden="true" />}

      {/* Top navigation — visible globally, adapts to auth state */}
      <Navbar />

      {/* Left Navigation Sidebar — visible only on protected pages */}
      {isProtectedRoute && <SideNavBar />}

      <div className={isProtectedRoute ? "md:pl-[280px] flex-grow flex flex-col" : "flex-grow flex flex-col"}>
        <Routes>
          {/* ── Public ── */}
          <Route path="/"             element={<Landing />} />

          {/* ── Auth (own full-screen layout) ── */}
          <Route path="/login"        element={<Login />} />
          <Route path="/signup"       element={<Signup />} />

          {/* ── App (protected — coming soon) ── */}
          <Route path="/explore"      element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/search"       element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/library"      element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/playlist/:id" element={<ProtectedRoute><Playlist /></ProtectedRoute>} />

          {/* ── Profile ── */}
          <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* ── Admin ── */}
          <Route path="/admin"        element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        </Routes>
      </div>

      {/* Footer — hidden on auth pages and protected pages */}
      {!isAuthRoute && !isProtectedRoute && <Footer />}

      {/* Bottom Player — visible only on protected pages */}
      {isProtectedRoute && <BottomPlayer />}
    </div>
  );
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        dispatch(setUser(user));
        dispatch(fetchLikedSongs());
        dispatch(fetchMyPlaylists());

        // Background profile sync and token validation
        apiClient.get('/user/profile')
          .then(response => {
            const updatedUser = response.data;
            const userPayload = {
              uid: updatedUser._id || updatedUser.firebaseUid,
              email: updatedUser.email,
              displayName: updatedUser.name,
              photoURL: updatedUser.photoURL,
              likedSongs: updatedUser.likedSongs || []
            };
            dispatch(setUser(userPayload));
            localStorage.setItem('user', JSON.stringify(userPayload));
          })
          .catch(err => {
            console.error('Failed to sync profile on mount:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              dispatch(clearUser());
            }
          });
      } catch (e) {
        console.error('Failed to parse user from localStorage:', e);
        dispatch(clearUser());
      }
    } else {
      dispatch(clearUser());
    }
  }, [dispatch]);

  return (
    <Router>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </Router>
  );
}

export default App;
