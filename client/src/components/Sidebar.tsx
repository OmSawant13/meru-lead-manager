import React from 'react';
import {
  LayoutDashboard,
  Users2,
  GitFork,
  Contact,
  Building2,
  BarChart3,
  Settings,
  Sparkles,
  Crown,
  ArrowRight,
} from 'lucide-react';
import { ViewMode } from '../types';

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

  return (
    <aside className="w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between p-5 min-h-screen flex-shrink-0 z-30">
      <div className="space-y-7">
        {/* Brand Logo with Glow */}
        <div className="flex items-center space-x-3 px-2 py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                LeadFlow
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 uppercase tracking-widest">
                Pro
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">Enterprise CRM</p>
          </div>
        </div>

        {/* Navigation Items with Smooth Springs */}
        <nav className="space-y-1">
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
                className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer group relative ${
                  isActive
                    ? 'bg-indigo-50/90 text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Settings & Luxury Upgrade Card */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className="w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-200 cursor-pointer group"
        >
          <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-45 transition-transform duration-300" />
          <span>Settings</span>
        </button>

        {/* Upgrade Card with Gradient Mesh */}
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-xs ring-1 ring-white/30">
              <Crown className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white">
              Plan
            </span>
          </div>

          <h4 className="text-xs font-black tracking-wide">Upgrade to Enterprise</h4>
          <p className="text-[11px] text-indigo-100/80 mt-1 leading-snug">
            Unlimited pipelines, AI lead scoring & automated workflows.
          </p>

          <button
            type="button"
            className="mt-3.5 w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-slate-900 bg-white hover:bg-indigo-50 active:scale-[0.98] rounded-xl shadow-md transition-all duration-200 cursor-pointer"
          >
            <span>Upgrade Now</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </aside>
  );
};
