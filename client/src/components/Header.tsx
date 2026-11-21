import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Calendar,
  Plus,
  Bell,
  LogOut,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  search: string;
  onSearchChange: (val: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  search,
  onSearchChange,
}) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 sm:px-8 flex items-center justify-between gap-4 sticky top-0 z-20 transition-all">
      {/* Global Search Input with Modern Inset & Shortcut Pill */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads, companies, or contacts..."
          className="w-full pl-10 pr-14 py-2.5 text-xs sm:text-sm bg-slate-100/70 hover:bg-slate-100/90 focus:bg-white border border-slate-200/80 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 transition-all duration-200 font-medium shadow-inner"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="px-2 py-0.5 text-[10px] font-bold text-slate-400 bg-white border border-slate-200/80 rounded-lg shadow-2xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center space-x-3.5">
        {/* Date Pill */}
        <div className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          <span>{currentDate}</span>
        </div>

        {/* Capture Lead CTA Button with Glowing Gradient */}
        <button
          onClick={onOpenCreateModal}
          className="btn-primary-glow inline-flex items-center px-4 py-2.5 text-xs font-bold text-white rounded-2xl cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Capture Lead</span>
        </button>

        {/* Notifications Bell with Animated Pulse */}
        <div className="relative">
          <button
            type="button"
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all duration-200 relative cursor-pointer active:scale-95 shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>
        </div>

        {/* User Avatar with Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-2xl hover:bg-slate-100 transition-all duration-200 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-md shadow-indigo-500/20 ring-2 ring-white">
              {getInitials(user?.name)}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" />
          </button>

          {/* Profile Dropdown with Smooth Animation */}
          {showProfileMenu && (
            <div className="glass-dropdown absolute right-0 mt-3 w-60 rounded-3xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="px-2 py-1.5">
                <div className="flex items-center space-x-2 px-3 py-1.5 text-xs text-indigo-700 font-bold bg-indigo-50/60 rounded-xl">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sales Representative</span>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-100 px-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
