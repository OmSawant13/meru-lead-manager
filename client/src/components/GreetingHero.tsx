import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface GreetingHeroProps {
  totalLeads: number;
  conversionRate: number;
}

export const GreetingHero: React.FC<GreetingHeroProps> = ({
  totalLeads,
  conversionRate,
}) => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | 'All'>('30D');

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1.5">
          <span>Good morning, {firstName}</span>
          <span>👋</span>
        </p>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-0.5">
          Your pipeline at a glance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          <strong className="text-slate-800 font-semibold">{totalLeads} active opportunities</strong>{' '}
          • <span className="text-indigo-600 font-bold">{conversionRate}% conversion rate</span>
        </p>
      </div>

      {/* Time range selector */}
      <div className="flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs self-start sm:self-auto">
        {(['7D', '30D', '90D', 'All'] as const).map((r) => {
          const isActive = timeRange === r;
          return (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-100/80 text-indigo-700 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
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
