import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from './Toast';
import { 
  LayoutDashboard, 
  FileHeart, 
  User, 
  LogOut, 
  Activity,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (err) {
      toast.error('Logout error occurred');
    }
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Assessment',
      path: '/assessment',
      icon: <FileHeart className="w-5 h-5" />,
    },
    {
      name: 'Profile',
      path: '/profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-650 dark:text-teal-400 shadow-sm shrink-0">
          <Activity className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-base leading-none block">BRPS Health</span>
          <span className="text-[10px] font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase block mt-0.5">SaaS Platform</span>
        </div>
      </div>

      {/* User Quick Info */}
      {user && (
        <div className="p-5 border-b border-slate-50 dark:border-slate-800/60">
          <div className="bg-slate-50/70 dark:bg-slate-950/20 rounded-xl p-4 flex items-center space-x-3 border border-slate-100 dark:border-slate-850">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-400 text-white font-bold flex items-center justify-center shadow-md shadow-teal-500/20 text-sm uppercase shrink-0">
              {user.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div className="overflow-hidden text-left">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate leading-tight">{user.name}</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user.job_role || 'Employee'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer
              ${isActive 
                ? 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 shadow-sm' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200'}
            `}
          >
            <div className="flex items-center space-x-3 text-left">
              <span className="transition-transform group-hover:scale-105 duration-200 shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-teal-600 dark:text-teal-400 shrink-0" />
          </NavLink>
        ))}
      </nav>

      {/* Theme Switcher Toggle Row */}
      <div className="px-4 py-3 mx-4 mb-2 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-center justify-between select-none">
        <span className="text-xs font-bold text-slate-550 dark:text-slate-400">Dark Theme</span>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-300 hover:text-teal-650 dark:hover:text-teal-400 transition-colors shadow-sm cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-50 dark:border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-650 dark:hover:text-rose-450 rounded-xl text-sm font-semibold transition-colors group cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Sticky Sidebar */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col h-screen sticky top-0 shrink-0 select-none">
        <SidebarContent />
      </aside>

      {/* 2. Mobile Floating Top Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-30 w-full select-none shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-650 dark:text-teal-400 shadow-sm">
            <Activity className="w-4.5 h-4.5 animate-pulse" />
          </div>
          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">BRPS Health</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 cursor-pointer shrink-0 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* 3. Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity md:hidden animate-fade-in"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
        />
      )}

      {/* 4. Mobile Sliding Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 flex flex-col h-screen select-none transition-transform duration-300 ease-out md:hidden shadow-2xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Drawer Close Header */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-650 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>
        <SidebarContent />
      </aside>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </>
  );
};

export default Sidebar;
