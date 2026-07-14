import { useState } from 'react';
import { Music, Users, PlayCircle, BarChart2 } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';
import DashboardCard from '../components/admin/DashboardCard';
import AnalyticsCard from '../components/admin/AnalyticsCard';
import UploadSongForm from '../components/admin/UploadSongForm';
import SongTable from '../components/admin/SongTable';
import { mockTrendingSongs } from '../data/mockData';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock data for analytics
  const barChartData = [
    { label: 'Mon', value: 1200, percentage: 40 },
    { label: 'Tue', value: 1900, percentage: 65 },
    { label: 'Wed', value: 1500, percentage: 50 },
    { label: 'Thu', value: 2400, percentage: 80 },
    { label: 'Fri', value: 3100, percentage: 100 },
    { label: 'Sat', value: 2800, percentage: 90 },
    { label: 'Sun', value: 2100, percentage: 70 },
  ];

  const topSongsData = mockTrendingSongs.slice(0, 4).map(song => ({
    label: song.title,
    subLabel: song.artist,
    image: song.image,
    value: `${Math.floor(Math.random() * 900 + 100)}K streams`
  }));

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
      case 'analytics':
        return (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Overview</h1>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard title="Total Songs" value="12,453" icon={Music} trend="+124 this week" />
              <DashboardCard title="Total Users" value="842.1K" icon={Users} trend="+5.2% this month" />
              <DashboardCard title="Total Playlists" value="45.2K" icon={PlayCircle} trend="+842 this week" />
              <DashboardCard title="Total Streams" value="12.4M" icon={BarChart2} trend="+1.2M this month" />
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnalyticsCard title="Weekly Streams" type="bar" data={barChartData} />
              <AnalyticsCard title="Most Played Songs" type="list" data={topSongsData} />
            </div>
          </div>
        );
      
      case 'upload':
        return (
          <div className="animate-in fade-in duration-300 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-8">Upload Content</h1>
            <UploadSongForm />
          </div>
        );

      case 'songs':
        return (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold text-on-surface tracking-tight mb-8">Content Management</h1>
            <SongTable />
          </div>
        );
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-96 text-on-surface-variant animate-in fade-in duration-300">
            <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
            <p className="text-sm">This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] mt-20">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
