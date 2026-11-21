import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateModal }) => {
  const { user, logout } = useAuth();

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
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Badge */}
          <div className="flex items-center space-x-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-slate-900">
                  LeadFlow
                </span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 uppercase tracking-wide">
                  Pro CRM
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 hidden sm:block">
                Meru Technosoft Screening • Full Stack Assessment
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {/* Today's Date Pill */}
            <div className="hidden md:flex items-center px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs font-semibold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              <span>{currentDate}</span>
            </div>

            {/* Quick Add Lead Button */}
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              <span>Capture Lead</span>
            </button>

            {/* User Profile & Logout */}
            <div className="flex items-center pl-3 border-l border-slate-200 space-x-2.5">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || 'Sales User'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{user?.email}</span>
              </div>

              <div
                className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-800 font-bold text-xs shadow-2xs"
                title={user?.email}
              >
                {getInitials(user?.name)}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
              </div>

              <button
                onClick={logout}
                title="Sign out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
