import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, Sun, Moon, Search, 
  ChevronDown, User as UserIcon, LogOut 
} from 'lucide-react';
import { PAGE_TITLES } from '../../constants';
import { useAuthStore } from '../../store/authStore';

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const { user, signOut } = useAuthStore();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Finlytic';

  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="p-2 lg:hidden text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold font-sora text-slate-900 dark:text-white transition-all">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue/10 rounded-full border border-blue/20">
            <div className="w-2 h-2 rounded-full bg-blue animate-pulse"></div>
            <span className="text-[10px] font-bold text-blue uppercase tracking-wider">Premium Plan</span>
          </div>

          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-10 transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-warning" />
            ) : (
              <Moon className="w-5 h-5 text-blue" />
            )}
          </button>

          <div className="w-[1px] h-6 bg-slate-200 dark:bg-slate-800 mx-2 hidden sm:block"></div>

          {user ? (
            <div className="group relative">
              <button className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue to-green flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-slate-900 shadow-sm">
                  {user?.displayName?.charAt(0) || 'U'}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-16 shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 origin-top-right">
                <div className="px-4 py-2 border-b border-slate-50 dark:border-slate-800 mb-1">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Profile Settings
                </button>
                <button 
                  onClick={() => signOut()}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <a href="/auth/login" className="px-5 py-2 bg-blue text-white text-sm font-bold rounded-10 hover:bg-blue-dark transition-colors border border-blue shadow-sm shadow-blue/20">
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
