import React from 'react';
import { LeadStats } from '../types';
import { ArrowRight, TrendingUp } from 'lucide-react';

interface PipelineHealthAndDonutProps {
  stats: LeadStats | null;
}

export const PipelineHealthAndDonut: React.FC<PipelineHealthAndDonutProps> = ({ stats }) => {
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
      <div className="card-hover lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Pipeline Health</h3>
          <p className="text-xs text-slate-400 mt-0.5">Lead flow across stages</p>
        </div>

        {/* Chevron Stage Flow & Conversion stats */}
        <div className="my-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Chevron steps with gentle hover scales */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Total Step */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs">
              <span className="block text-base font-black text-indigo-950 leading-none mb-1">
                {total}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                Total
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            {/* New Step */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs">
              <span className="block text-base font-black text-blue-950 leading-none mb-1">
                {newCount}
              </span>
              <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                New
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Contacted Step */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-cyan-50/70 border border-cyan-100 text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs">
              <span className="block text-base font-black text-cyan-950 leading-none mb-1">
                {contactedCount}
              </span>
              <span className="text-[10px] font-extrabold text-cyan-700 uppercase tracking-wider">
                Contacted
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Qualified Step */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs">
              <span className="block text-base font-black text-emerald-950 leading-none mb-1">
                {qualifiedCount}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider">
                Qualified
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

            {/* Closed / Lost Step */}
            <div className="px-3.5 py-2.5 rounded-2xl bg-rose-50/70 border border-rose-100 text-center min-w-[62px] transition-transform duration-200 hover:scale-105 cursor-pointer shadow-2xs">
              <span className="block text-base font-black text-rose-950 leading-none mb-1">
                {lostCount}
              </span>
              <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">
                Lost
              </span>
            </div>
          </div>

          {/* Right Conversion Stat Callout */}
          <div className="text-right sm:pl-5 sm:border-l border-slate-100 flex-shrink-0">
            <span className="text-3xl font-black text-slate-900 tracking-tight block">
              {conversionRate}%
            </span>
            <span className="text-xs text-slate-400 font-bold block mt-0.5">Conversion Rate</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1.5 border border-emerald-200/60 shadow-2xs">
              <TrendingUp className="w-2.5 h-2.5 mr-1" />
              +8 pp
            </span>
          </div>
        </div>
      </div>

      {/* Right Card: Stage Distribution Donut Chart */}
      <div className="card-hover lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 tracking-tight">Stage Distribution</h3>
        </div>

        <div className="my-2 flex items-center justify-between gap-5">
          {/* Donut Chart SVG */}
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="11"
              />
              {/* New slice */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#8b5cf6"
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
                stroke="#ec4899"
                strokeWidth="11"
                strokeDasharray={`${lostDash} ${c}`}
                strokeDashoffset={lostOffset}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 leading-none">{total}</span>
              <span className="text-[10px] font-extrabold text-slate-400 mt-0.5 uppercase tracking-wider">Leads</span>
            </div>
          </div>

          {/* Legend on Right with Smooth Hover States */}
          <div className="space-y-2 flex-1 text-xs font-semibold">
            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-xs" />
                <span className="text-slate-600">New Inquiries</span>
              </div>
              <span className="font-extrabold text-slate-900">{newPct}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                <span className="text-slate-600">Contacted</span>
              </div>
              <span className="font-extrabold text-slate-900">{contactedPct}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                <span className="text-slate-600">Qualified</span>
              </div>
              <span className="font-extrabold text-slate-900">{qualifiedPct}%</span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-xs" />
                <span className="text-slate-600">Closed / Lost</span>
              </div>
              <span className="font-extrabold text-slate-900">{lostPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
