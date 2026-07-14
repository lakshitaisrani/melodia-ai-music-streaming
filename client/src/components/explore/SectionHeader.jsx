import { Link } from 'react-router-dom';

const SectionHeader = ({ title, showViewAll = false, onViewAll }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-semibold text-2xl text-on-surface">{title}</h3>
      {showViewAll && (
        <button onClick={onViewAll} className="text-primary text-sm font-medium hover:underline transition-all">
          View All
        </button>
      )}
    </div>
  );
};

export default SectionHeader;
