import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>

        <footer className="p-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Finlytic. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
