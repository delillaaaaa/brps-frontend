import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './Toast';
import { 
  LayoutDashboard, 
  FileHeart, 
  User, 
  LogOut, 
  Activity,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

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
      path: '/setup-profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen sticky top-0 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-50 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 shadow-sm shadow-teal-100 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-slate-800 text-base leading-none block">BRPS Health</span>
          <span className="text-[10px] font-semibold text-teal-600 tracking-wider uppercase block mt-0.5">SaaS Platform</span>
        </div>
      </div>

      {/* User Quick Info */}
      {user && (
        <div className="p-5 border-b border-slate-50">
          <div className="bg-slate-50/70 rounded-xl p-4 flex items-center space-x-3 border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-teal-400 text-white font-bold flex items-center justify-center shadow-md shadow-teal-500/20 text-sm uppercase">
              {user.name ? user.name.slice(0, 2) : 'US'}
            </div>
            <div className="overflow-hidden">
              <h4 className="font-semibold text-slate-700 text-sm truncate leading-tight">{user.name}</h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.job_role || 'Employee'}</p>
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
            className={({ isActive }) => `
              flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group cursor-pointer
              ${isActive 
                ? 'bg-teal-50 text-teal-700 shadow-sm shadow-teal-100/50' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="transition-transform group-hover:scale-105 duration-200 shrink-0">{item.icon}</span>
              <span>{item.name}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-teal-600 shrink-0" />
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-sm font-semibold transition-colors group cursor-pointer"
        >
          <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
