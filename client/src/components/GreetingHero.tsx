import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface GreetingHeroProps {
  totalLeads: number;
  conversionRate: number;
}

export const GreetingHero: React.FC<GreetingHeroProps> = ({
  totalLeads,
  conversionRate,
}) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'All'>('30D');

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-slate-400 flex items-center gap-1.5">
          <span>Good morning, {firstName}</span>
          <span>👋</span>
        </p>
        <h1 className={`text-2xl sm:text-3xl font-black tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Your pipeline at a glance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
          <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{totalLeads} active opportunities</strong>{' '}
          • <span className="text-indigo-400 font-bold">{conversionRate}% conversion rate</span>
        </p>
      </div>

      {/* Time range selector */}
      <div
        className={`flex items-center p-1 rounded-2xl border shadow-2xs self-start sm:self-auto ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/90 border-slate-200/80'
        }`}
      >
        {(['7D', '30D', '90D', 'All'] as const).map((r) => {
          const isActive = timeRange === r;
          return (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3.5 py-1 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {r}
            </button>
          );
        })}
      </div>
    </div>
  );
};
