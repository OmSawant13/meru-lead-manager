import React from 'react';
import {
  LayoutDashboard,
  Users2,
  GitFork,
  Contact,
  Building2,
  BarChart3,
  Sparkles,
  Crown,
  LogOut,
} from 'lucide-react';
import { ViewMode } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  viewMode,
  onViewModeChange,
}) => {
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: Users2 },
    { id: 'pipeline', label: 'Pipeline', icon: GitFork },
    { id: 'contacts', label: 'Contacts', icon: Contact },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    if (id === 'pipeline') {
      onViewModeChange('kanban');
    } else if (id === 'leads' || id === 'dashboard') {
      onViewModeChange('table');
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <aside
      className={`w-64 lg:w-72 h-full flex flex-col justify-between p-5 rounded-[28px] sm:rounded-[32px] transition-all duration-300 flex-shrink-0 z-30 shadow-2xl ${
        isDark
          ? 'bg-[#0f1422]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]'
          : 'bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_20px_50px_rgba(15,23,42,0.06)]'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Logo with Glowing Halo */}
        <div className="flex items-center space-x-3.5 px-2 py-1">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                LeadFlow
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-500/20 text-indigo-400 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                Pro
              </span>
            </div>
            <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Enterprise CRM
            </p>
          </div>
        </div>

        {/* Live Atlas Status Pill */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 rounded-2xl border text-xs font-semibold ${
            isDark
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200/80 text-emerald-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-tight">MongoDB Atlas</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider opacity-80">Online</span>
        </div>

        {/* Navigation Items with Floating Glow Pills */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentTab === item.id ||
              (item.id === 'pipeline' && viewMode === 'kanban');

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 cursor-pointer group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/35 scale-[1.02]'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-white/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                    isActive
                      ? 'text-white'
                      : isDark
                      ? 'text-slate-400 group-hover:text-white'
                      : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: User Pill & Holographic Upgrade Card */}
      <div className={`space-y-3.5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
        {/* Holographic Gradient Card */}
        <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/20 group">
          <div className={`p-3.5 rounded-[23px] backdrop-blur-xl ${isDark ? 'bg-[#121626]' : 'bg-slate-900 text-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-md font-bold text-xs">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white">
                Pro Plan
              </span>
            </div>

            <h4 className="text-xs font-black tracking-wide text-white">LeadFlow AI</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Smart auto-scoring & conversion analytics active.
            </p>
          </div>
        </div>

        {/* User Card with Quick Logout */}
        <div
          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
          }`}
        >
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black text-xs flex items-center justify-center shadow-sm flex-shrink-0">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {user?.name || 'Alex Morgan'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || 'demo@example.com'}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            title="Sign out"
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isDark
                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
                : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
