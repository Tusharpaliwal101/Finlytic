import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, ArrowDownLeft, Target, 
  Palmtree, FileText, Menu, X, LucideIcon, BarChart2,
  PieChart, TrendingDown, BookMarked
} from 'lucide-react';
import { NAV_ITEMS } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Wallet,
  ArrowDownLeft,
  Target,
  Palmtree,
  FileText,
  BarChart2,
  PieChart,
  TrendingDown,
  BookMarked
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50
        transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue p-2 rounded-10">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold font-sora tracking-tight text-slate-900 dark:text-white">
                Finlytic
              </span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-10 font-medium transition-all group
                    ${isActive 
                      ? 'nav-item-active' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <Icon className={`w-5 h-5 transition-colors`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom section (Optional: help, upgrade, etc) */}
          <div className="p-4 mt-auto">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-16 p-4 border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Need Help?</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Check our detailed financial guides.</p>
              <button className="text-xs font-bold text-blue hover:underline">Read Guides</button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
