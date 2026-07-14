const PlaylistStats = ({ stats }) => {
  return (
    <div className="bg-surface-container/40 p-6 rounded-3xl border border-white/5 mb-8">
      <h3 className="font-headline-md text-lg text-on-surface mb-6">Statistics</h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant text-sm font-medium">❤️ Likes</span>
          <span className="font-bold text-on-surface">{stats.likes}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant text-sm font-medium">📥 Saves</span>
          <span className="font-bold text-on-surface">{stats.saves}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant text-sm font-medium">▶ Plays</span>
          <span className="font-bold text-on-surface">{stats.plays}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant text-sm font-medium">🔗 Shares</span>
          <span className="font-bold text-on-surface">{stats.shares}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistStats;
