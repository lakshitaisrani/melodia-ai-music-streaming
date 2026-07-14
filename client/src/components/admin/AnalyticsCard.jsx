const AnalyticsCard = ({ title, data, type }) => {
  return (
    <div className="bg-surface-container rounded-2xl p-6 border border-white/5 flex flex-col gap-6">
      <h3 className="font-headline-sm text-lg font-bold text-on-surface">{title}</h3>
      
      {/* Simple Mock Bar Chart */}
      {type === 'bar' && (
        <div className="flex items-end gap-2 h-48 mt-auto pb-4 border-b border-white/10 relative">
          {/* Y-axis lines (mock) */}
          <div className="absolute inset-x-0 bottom-1/3 border-t border-white/5 w-full"></div>
          <div className="absolute inset-x-0 bottom-2/3 border-t border-white/5 w-full"></div>
          <div className="absolute inset-x-0 top-0 border-t border-white/5 w-full"></div>
          
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 relative z-10 group">
              {/* Tooltip on hover */}
              <div className="absolute -top-8 bg-surface-container-high text-xs font-bold text-on-surface px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}
              </div>
              <div 
                className="w-full bg-primary/50 group-hover:bg-primary rounded-t-sm transition-all"
                style={{ height: `${item.percentage}%` }}
              ></div>
              <span className="text-[10px] text-on-surface-variant uppercase font-mono hidden sm:block truncate w-full text-center">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Simple List view for most played */}
      {type === 'list' && (
        <div className="flex flex-col gap-4">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <span className="text-lg font-bold text-on-surface-variant w-4 text-center">{idx + 1}</span>
              <img src={item.image} alt={item.label} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-grow min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">{item.label}</p>
                <p className="text-xs text-on-surface-variant truncate">{item.subLabel}</p>
              </div>
              <span className="text-sm font-bold text-primary">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalyticsCard;
