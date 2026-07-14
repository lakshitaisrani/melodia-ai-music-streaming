import PlaylistStats from './PlaylistStats';
import PlaylistCard from '../explore/PlaylistCard';

const PlaylistSidebar = ({ playlist, similarPlaylists }) => {
  return (
    <aside className="w-full xl:w-80 flex-shrink-0 flex flex-col gap-8">
      <PlaylistStats stats={playlist.stats} />
      
      <section>
        <h3 className="font-headline-md text-lg text-on-surface mb-6">Similar Playlists</h3>
        <div className="flex flex-col gap-6">
          {similarPlaylists.map(playlist => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      </section>
    </aside>
  );
};

export default PlaylistSidebar;
