import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Search,
  Calendar,
  Plus,
  Bell,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sun,
  Moon,
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
  const { isDark, toggleTheme } = useTheme();
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
    <header
      className={`h-20 px-6 sm:px-8 flex items-center justify-between gap-4 border-b transition-all duration-300 ${
        isDark
          ? 'bg-[#0f1422]/60 backdrop-blur-xl border-white/10'
          : 'bg-white/80 backdrop-blur-xl border-slate-200/80'
      }`}
    >
      {/* Global Search Input with Inset Glow */}
      <div className="relative flex-1 max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search leads, companies, or contacts..."
          className={`w-full pl-10 pr-14 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all duration-200 font-medium ${
            isDark
              ? 'bg-[#161c2e]/70 border-white/10 text-white placeholder-slate-400 focus:bg-[#1a2136] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
              : 'bg-slate-100/70 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
          }`}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd
            className={`px-2 py-0.5 text-[10px] font-bold rounded-lg shadow-2xs border ${
              isDark
                ? 'bg-white/10 border-white/10 text-slate-300'
                : 'bg-white border-slate-200 text-slate-400'
            }`}
          >
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* Right Action Icons & Profile */}
      <div className="flex items-center space-x-3">
        {/* Dark / Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2.5 rounded-2xl border transition-all duration-300 cursor-pointer active:scale-90 ${
            isDark
              ? 'bg-white/5 border-white/10 text-amber-300 hover:bg-white/10 hover:text-amber-200 shadow-lg shadow-amber-500/5'
              : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200 shadow-2xs'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4 animate-spin-slow" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Date Pill */}
        <div
          className={`hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold border shadow-2xs ${
            isDark
              ? 'bg-white/5 border-white/10 text-slate-300'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span>{currentDate}</span>
        </div>

        {/* Capture Lead CTA Button with Glowing Neon */}
        <button
          onClick={onOpenCreateModal}
          className="btn-neon inline-flex items-center px-4 py-2.5 text-xs font-bold text-white rounded-2xl cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Capture Lead</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            className={`p-2.5 rounded-2xl border transition-all duration-200 relative cursor-pointer active:scale-95 shadow-2xs ${
              isDark
                ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-indigo-900 animate-pulse" />
          </button>
        </div>

        {/* User Avatar with Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 p-1 rounded-2xl hover:bg-white/10 transition-all duration-200 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-indigo-500/30 ring-2 ring-white/20">
              {getInitials(user?.name)}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#0f1422]" />
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform duration-200" />
          </button>

          {/* Profile Dropdown with Smooth Animation */}
          {showProfileMenu && (
            <div
              className={`absolute right-0 mt-3 w-60 rounded-3xl py-2 z-50 border shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
                isDark
                  ? 'bg-[#151b2c] border-white/10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                  : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <p className="text-xs font-bold">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="px-2 py-1.5">
                <div
                  className={`flex items-center space-x-2 px-3 py-1.5 text-xs font-bold rounded-xl ${
                    isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Sales Representative</span>
                </div>
              </div>

              <div className={`pt-1 border-t px-2 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
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
