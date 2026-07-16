import { Link, useLocation } from 'react-router-dom';
import { Compass, Library, Plus, Heart, Download } from 'lucide-react';

const SideNavBar = () => {
  const location = useLocation();
  const activePath = location.pathname;

  const links = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Library', path: '/library', icon: Library },
  ];

  return (
    <aside className="hidden md:flex fixed left-0 top-0 bottom-24 w-[280px] z-40 bg-surface-container/30 backdrop-blur-2xl border-r border-white/10 shadow-2xl flex-col p-6 pt-28 select-none overflow-y-auto no-scrollbar">
      <div className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activePath === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
                isActive
                  ? 'text-primary bg-primary/10 border-r-2 border-primary'
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
              <span className="text-sm tracking-wide">{link.label}</span>
            </Link>
          );
        })}
      </div>
      

      
      <div className="mt-auto space-y-1">
        <div className="text-on-surface-variant text-[10px] uppercase tracking-widest font-extrabold px-4 mb-2 opacity-50">
          Your Collection
        </div>
        <Link
          to="/library"
          className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold ${
            activePath === '/library'
              ? 'text-on-surface hover:bg-white/5'
              : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
          }`}
        >
          <Heart size={20} className="text-on-surface-variant" />
          <span className="text-sm tracking-wide">Liked Songs</span>
        </Link>
      </div>
    </aside>
  );
};

export default SideNavBar;
