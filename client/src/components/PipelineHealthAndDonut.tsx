import React from 'react';
import { LeadStats } from '../types';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PipelineHealthAndDonutProps {
  stats: LeadStats | null;
}

export const PipelineHealthAndDonut: React.FC<PipelineHealthAndDonutProps> = ({ stats }) => {
  const { isDark } = useTheme();

  const total = stats?.total ?? 0;
  const newCount = stats?.byStatus?.New ?? 0;
  const contactedCount = stats?.byStatus?.Contacted ?? 0;
  const qualifiedCount = stats?.byStatus?.Qualified ?? 0;
  const lostCount = stats?.byStatus?.Lost ?? 0;

  const conversionRate = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;

  const newPct = total > 0 ? Math.round((newCount / total) * 100) : 0;
  const contactedPct = total > 0 ? Math.round((contactedCount / total) * 100) : 0;
  const qualifiedPct = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;
  const lostPct = total > 0 ? Math.round((lostCount / total) * 100) : 0;

  const c = 238.76;
  const newDash = (newPct / 100) * c;
  const contactedDash = (contactedPct / 100) * c;
  const qualifiedDash = (qualifiedPct / 100) * c;
  const lostDash = (lostPct / 100) * c;

  const newOffset = 0;
  const contactedOffset = -newDash;
  const qualifiedOffset = -(newDash + contactedDash);
  const lostOffset = -(newDash + contactedDash + qualifiedDash);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Left Card: Pipeline Health & Chevron Funnel */}
      <div
        className={`lg:col-span-7 p-6 rounded-[28px] flex flex-col justify-between ${
          isDark ? 'bento-card' : 'bento-card-light'
        }`}
      >
        <div>
          <h3 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pipeline Health
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Lead progression velocity across stages</p>
        </div>

        {/* Chevron Stage Flow & Conversion stats */}
        <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Chevron steps with gentle hover scales */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Total Step */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs border ${
                isDark
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-indigo-50/80 border-indigo-100 text-indigo-950'
              }`}
            >
              <span className={`block text-lg font-extrabold tabular-nums leading-none mb-1 ${isDark ? 'text-white' : 'text-indigo-950'}`}>
                {total}
              </span>
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                Total
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

            {/* New Step */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs border ${
                isDark
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : 'bg-blue-50/80 border-blue-100 text-blue-950'
              }`}
            >
              <span className={`block text-lg font-extrabold tabular-nums leading-none mb-1 ${isDark ? 'text-white' : 'text-blue-950'}`}>
                {newCount}
              </span>
              <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                New
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

            {/* Contacted Step */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs border ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-amber-50/80 border-amber-100 text-amber-950'
              }`}
            >
              <span className={`block text-lg font-extrabold tabular-nums leading-none mb-1 ${isDark ? 'text-white' : 'text-amber-950'}`}>
                {contactedCount}
              </span>
              <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">
                Contacted
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

            {/* Qualified Step */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs border ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50/80 border-emerald-100 text-emerald-950'
              }`}
            >
              <span className={`block text-lg font-extrabold tabular-nums leading-none mb-1 ${isDark ? 'text-white' : 'text-emerald-950'}`}>
                {qualifiedCount}
              </span>
              <span className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">
                Qualified
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />

            {/* Closed / Lost Step */}
            <div
              className={`px-3.5 py-2.5 rounded-2xl text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs border ${
                isDark
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-rose-50/80 border-rose-100 text-rose-950'
              }`}
            >
              <span className={`block text-lg font-extrabold tabular-nums leading-none mb-1 ${isDark ? 'text-white' : 'text-rose-950'}`}>
                {lostCount}
              </span>
              <span className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">
                Lost
              </span>
            </div>
          </div>

          {/* Right Conversion Stat Callout */}
          <div className={`text-right sm:pl-5 sm:border-l flex-shrink-0 ${isDark ? 'border-white/10' : 'border-slate-200/80'}`}>
            <span className={`text-3xl font-extrabold tracking-tight tabular-nums block ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {conversionRate}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold block mt-0.5">Conversion Rate</span>
            <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200 dark:border-emerald-500/30 shadow-2xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8 pp
            </span>
          </div>
        </div>
      </div>

      {/* Right Card: Stage Distribution Donut Chart */}
      <div
        className={`lg:col-span-5 p-6 rounded-[28px] flex flex-col justify-between ${
          isDark ? 'bento-card' : 'bento-card-light'
        }`}
      >
        <div>
          <h3 className={`text-sm sm:text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Stage Distribution
          </h3>
        </div>

        <div className="my-2 flex items-center justify-between gap-5">
          {/* Donut Chart SVG with Center Glow */}
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'}
                strokeWidth="11"
              />
              {/* New slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#6366f1"
                strokeWidth="11"
                strokeDasharray={`${newDash} ${c}`}
                strokeDashoffset={newOffset}
                className="transition-all duration-700"
              />
              {/* Contacted slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="11"
                strokeDasharray={`${contactedDash} ${c}`}
                strokeDashoffset={contactedOffset}
                className="transition-all duration-700"
              />
              {/* Qualified slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#10b981"
                strokeWidth="11"
                strokeDasharray={`${qualifiedDash} ${c}`}
                strokeDashoffset={qualifiedOffset}
                className="transition-all duration-700"
              />
              {/* Lost slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f43f5e"
                strokeWidth="11"
                strokeDasharray={`${lostDash} ${c}`}
                strokeDashoffset={lostOffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`text-2xl font-extrabold tabular-nums leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>{total}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Leads</span>
            </div>
          </div>

          {/* Legend on Right with Smooth Hover States */}
          <div className="space-y-2 flex-1 text-xs font-semibold">
            <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-xs" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>New Inquiries</span>
              </div>
              <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{newPct}%</span>
            </div>

            <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Contacted</span>
              </div>
              <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{contactedPct}%</span>
            </div>

            <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Qualified</span>
              </div>
              <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{qualifiedPct}%</span>
            </div>

            <div className={`flex items-center justify-between p-1.5 rounded-xl transition-colors cursor-pointer ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>Closed / Lost</span>
              </div>
              <span className={`font-bold tabular-nums ${isDark ? 'text-white' : 'text-slate-900'}`}>{lostPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
