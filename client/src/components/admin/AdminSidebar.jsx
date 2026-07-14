import { LayoutDashboard, Music, UploadCloud, Users, BarChart3, Settings } from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'songs', label: 'Songs', icon: Music },
    { id: 'upload', label: 'Upload Song', icon: UploadCloud },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-surface-container-high/50 lg:border-r border-white/5 lg:min-h-[calc(100vh-80px)] p-4 flex flex-col gap-2 overflow-x-auto lg:overflow-x-hidden">
      <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-bold ${
                isActive 
                  ? 'bg-primary/20 text-primary shadow-lg shadow-primary/5' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default AdminSidebar;
