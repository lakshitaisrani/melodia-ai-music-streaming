const DashboardCard = ({ title, value, icon: Icon, trend }) => {
  const isPositive = trend && trend.startsWith('+');

  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-white/5 flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5">
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">{title}</h4>
        <p className="text-3xl font-extrabold text-on-surface mt-1">{value}</p>
      </div>
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default DashboardCard;
