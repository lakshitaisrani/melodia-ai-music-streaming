import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Music2, Search, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/authSlice';
import { NAV_LINKS } from '../utils/landingData';

/**
 * Reusable Navbar component.
 * Conditionally renders public or authenticated navigation based on state.
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state) => state.auth);
  const isLanding = location.pathname === '/';
  
  // Real authentication state
  const isAuthenticated = !!currentUser;

  // Deepen glass effect after scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    if (href.startsWith('#') && isLanding) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch(clearUser());
    navigate('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isAuthenticated
            ? 'bg-surface/70 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/30'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <nav className={`mx-auto flex items-center justify-between h-18 md:h-20 ${isAuthenticated ? 'px-6 max-w-[1800px]' : 'container-melodia'}`}>
          {/* ── Brand ── */}
          <Link
            to={isAuthenticated ? "/explore" : "/"}
            className="flex items-center gap-2.5 group flex-shrink-0"
            aria-label="Melodia Home"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-container to-secondary-container flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <Music2 size={18} className="text-on-primary" />
            </span>
            <span className="font-extrabold text-headline-md text-on-surface tracking-tight">
              Melodia
            </span>
          </Link>

          {!isAuthenticated ? (
            <>
              {/* ── Public Desktop nav links ── */}
              <ul className="hidden md:flex items-center gap-8" role="navigation">
                {NAV_LINKS.map(({ label, href, active }) => (
                  <li key={label}>
                    <a
                      href={isLanding ? href : '/'}
                      onClick={(e) => handleNavClick(e, href)}
                      className={`nav-link ${active ? 'active' : ''}`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>

              {/* ── Public Desktop CTAs ── */}
              <div className="hidden md:flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-on-surface-variant hover:text-primary transition-colors duration-200 px-4 py-2 font-medium text-body-md rounded-lg hover:bg-white/5"
                >
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm">
                  Get Started
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* ── Auth Center: Search ── */}
              <div className="hidden md:flex flex-1 max-w-xl mx-8 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search artists, songs, or podcasts..."
                  className="w-full bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-highest border border-white/5 rounded-full pl-10 pr-16 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-on-surface-variant"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      navigate(`/search?q=${encodeURIComponent(e.target.value.trim())}`);
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-60">
                  <kbd className="hidden sm:inline-flex items-center justify-center rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-white h-5">Enter</kbd>
                </div>
              </div>

              {/* ── Auth Right: Actions ── */}
              <div className="hidden md:flex items-center gap-4 md:gap-6">
                <Link to="/search" className="lg:hidden text-on-surface-variant hover:text-white transition-colors p-1">
                  <Search className="w-5 h-5" />
                </Link>

                <button className="text-on-surface-variant hover:text-white transition-colors p-1">
                  <Bell className="w-5 h-5" />
                </button>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full bg-surface-variant overflow-hidden border border-white/10 cursor-pointer hover:border-primary/50 transition-colors ml-2 focus:outline-none"
                  >
                    <img 
                      src={currentUser.photoURL || "https://lh3.googleusercontent.com/aida-public/AB6AXuC37mWftkGPM4yrFjGInm0CR-pBDfG7fUPFfTkW-ozfbZduJjpLHfIBgA_7DDYwHTPVsI4_vojXY6ORvDGjhnSNOPlNdjNUu3mcEJXKyTefPVcBeEUVG3AKK99kyVUkZF8ERr7aKJa_64oU4gWBd5QIcanym90VVBHwXML-0iQSZi6x9JjP31vJBUyrz5Blj5srud1DXx6RuZS_Zi1at-wAlv1Xfy-lidi522_2Q5c08z08NWhCeVMwJ4WmwXKhoa94-rJnzPLqa-Y"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-surface-container-high border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                      <div className="px-4 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-bold text-on-surface truncate">{currentUser.displayName || "User"}</p>
                        <p className="text-xs text-on-surface-variant truncate">{currentUser.email}</p>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-2 text-sm text-on-surface hover:bg-white/5 transition-colors">
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors text-left">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Mobile menu toggle ── */}
          <button
            className="md:hidden p-2 rounded-xl text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-md"
          onClick={() => setMobileOpen(false)}
        />
        <nav
          className={`absolute top-0 right-0 bottom-0 w-72 glass-panel border-l border-white/10 flex flex-col gap-0 transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
            <span className="font-extrabold text-on-surface text-headline-md">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2 rounded-xl hover:bg-white/5 text-on-surface-variant"
            >
              <X size={20} />
            </button>
          </div>

          {!isAuthenticated ? (
            <>
              <ul className="flex flex-col px-4 py-6 gap-1">
                {NAV_LINKS.map(({ label, href, active }) => (
                  <li key={label}>
                    <a
                      href={isLanding ? href : '/'}
                      onClick={(e) => handleNavClick(e, href)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                        active
                          ? 'text-primary bg-primary/10'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto px-6 pb-10 flex flex-col gap-3">
                <Link to="/login" className="btn-ghost w-full text-center justify-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/signup" className="btn-primary w-full text-center justify-center" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
              </div>
            </>
          ) : (
            <ul className="flex flex-col px-4 py-6 gap-1">
              <div className="px-4 py-2 mb-2">
                <p className="text-sm font-bold text-on-surface truncate">{currentUser.displayName || "User"}</p>
                <p className="text-xs text-on-surface-variant truncate">{currentUser.email}</p>
              </div>
              <li><Link to="/search" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5"><Search className="w-5 h-5"/> Search</Link></li>
              <li><Link to="/library" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5"><Music2 className="w-5 h-5"/> Library</Link></li>
              <li><Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-on-surface-variant hover:text-on-surface hover:bg-white/5"><UserIcon className="w-5 h-5"/> Profile</Link></li>
              <div className="border-t border-white/10 my-2"></div>
              <li><button onClick={() => { handleLogout(); setMobileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-error hover:bg-error/10 text-left"><LogOut className="w-5 h-5"/> Logout</button></li>
            </ul>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
