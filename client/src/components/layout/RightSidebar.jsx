import { mockFriendActivity, mockLiveNow } from '../../data/mockData';

const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col col-span-3 space-y-8">
      {/* Currently Playing Widget */}
      <div className="glass p-6 rounded-2xl sticky top-28">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-on-surface">
          <span className="material-symbols-outlined text-primary">equalizer</span>
          Live Now
        </h3>
        <div className="aspect-square rounded-xl overflow-hidden mb-4 shadow-2xl relative">
          <img 
            src={mockLiveNow.image} 
            alt={mockLiveNow.title} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="text-center">
          <h4 className="font-bold text-white text-lg">{mockLiveNow.title}</h4>
          <p className="text-primary text-sm font-mono mt-1">{mockLiveNow.artist}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-on-surface-variant uppercase tracking-widest">
            <span>Recently played with:</span>
          </div>
          <div className="flex -space-x-2">
            {mockLiveNow.listeners.map((src, index) => (
              <div key={index} className="w-8 h-8 rounded-full border-2 border-surface glass overflow-hidden shadow-sm">
                <img src={src} alt="listener" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-surface glass bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container shadow-sm">
              +{mockLiveNow.extraListeners}
            </div>
          </div>
        </div>
      </div>

      {/* Friend Activity */}
      <div className="glass p-6 rounded-2xl">
        <h3 className="text-lg font-bold mb-6 text-on-surface">Friend Activity</h3>
        <div className="space-y-6">
          {mockFriendActivity.map(friend => (
            <div key={friend.id} className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 shrink-0 border border-white/5 shadow-sm">
                <img src={friend.avatar} alt={friend.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{friend.name}</p>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">Listening to: {friend.listeningTo}</p>
              </div>
              {friend.active ? (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(221,183,255,0.8)]"></div>
              ) : (
                <div className="w-2 h-2 rounded-full bg-primary/20"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
