import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, TrendingUp } from 'lucide-react';

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
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Good morning, {firstName} 👋
          </span>
        </div>

        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Your pipeline at a glance
        </h1>

        <div className="flex items-center space-x-2 mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {totalLeads} active opportunities
          </span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            {conversionRate}% conversion rate
          </span>
        </div>
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
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
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
