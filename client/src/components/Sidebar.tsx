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
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-5 min-h-screen flex-shrink-0">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            LeadFlow
          </span>
        </div>

        {/* Main Navigation */}
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
                className={`w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-600 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Settings & Upgrade to Pro */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => handleNavClick('settings')}
          className="w-full flex items-center space-x-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </button>

        {/* Upgrade Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-violet-50/60 to-purple-50/40 border border-indigo-100/80 shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-2.5 shadow-sm shadow-indigo-300">
            <Crown className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Upgrade to Pro</h4>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            More leads, automations and advanced reports.
          </p>
          <button
            type="button"
            className="mt-3 w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <span>Upgrade</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
