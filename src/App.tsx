import React, { useState } from 'react';
import { NavigationTabs } from './components/NavigationTabs';
import { MeetingForm } from './components/MeetingForm';
import { Dashboard } from './components/Dashboard';
import { PrintView } from './components/PrintView';

function App() {
  const [activeTab, setActiveTab] = useState('schedule');

  const renderContent = () => {
    switch (activeTab) {
      case 'schedule':
        return <MeetingForm />;
      case 'dashboard':
        return <Dashboard />;
      case 'print':
        return <PrintView />;
      default:
        return <MeetingForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meeting & Beverage Notifier
            </h1>
            <p className="text-white/70 text-lg">
              Schedule your meetings and order refreshments with style
            </p>
          </div>

          {/* Navigation */}
          <NavigationTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {/* Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default App;