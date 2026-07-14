import { Edit2, Trash2, Eye } from 'lucide-react';
import { mockTrendingSongs } from '../../data/mockData';

const SongTable = () => {
  // Use mock data for the table
  const songs = mockTrendingSongs.map(song => ({
    ...song,
    uploadDate: '2023-10-24', // Mock date
    status: Math.random() > 0.2 ? 'Live' : 'Processing' // Mock status
  }));

  return (
    <div className="bg-surface-container rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">Manage Songs</h2>
        <div className="text-sm text-on-surface-variant font-medium">
          Total: {songs.length}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-surface-container-low text-on-surface-variant text-xs uppercase tracking-widest font-bold">
              <th className="px-6 py-4 whitespace-nowrap">Song</th>
              <th className="px-6 py-4 whitespace-nowrap hidden md:table-cell">Artist</th>
              <th className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">Genre</th>
              <th className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">Upload Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {songs.map((song) => (
              <tr key={song.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <img src={song.image} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-sm text-on-surface truncate max-w-[150px] sm:max-w-[200px]">{song.title}</div>
                      <div className="text-xs text-on-surface-variant md:hidden truncate max-w-[150px]">{song.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant hidden md:table-cell max-w-[150px] truncate">
                  {song.artist}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant hidden lg:table-cell">
                  <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium">Pop</span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant hidden xl:table-cell whitespace-nowrap">
                  {song.uploadDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    song.status === 'Live' 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}>
                    {song.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-secondary hover:bg-secondary/10 transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SongTable;
