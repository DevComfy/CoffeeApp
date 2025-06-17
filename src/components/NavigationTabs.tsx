import React from 'react';
import { Calendar, BarChart3, Printer } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'schedule', label: 'Schedule Meeting', icon: Calendar },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'print', label: 'Print View', icon: Printer },
  ];

  return (
    <div className="glass-nav mb-8">
      <div className="flex space-x-1 p-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${activeTab === id 
                ? 'bg-white/20 text-white shadow-lg backdrop-blur-xl border border-white/30' 
                : 'text-white/70 hover:text-white hover:bg-white/10'
              }
            `}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};