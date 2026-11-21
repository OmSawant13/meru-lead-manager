import React from 'react';
import { LeadStats } from '../types';
import { Users, Clock, CheckCircle2, XCircle, Sparkles, TrendingUp, BarChart3 } from 'lucide-react';

interface StatsDashboardProps {
  stats: LeadStats | null;
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
  isLoading: boolean;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  selectedStatus = 'All',
  onSelectStatus,
  isLoading,
}) => {
  const total = stats?.total ?? 0;
  const newCount = stats?.byStatus?.New ?? 0;
  const contactedCount = stats?.byStatus?.Contacted ?? 0;
  const qualifiedCount = stats?.byStatus?.Qualified ?? 0;
  const lostCount = stats?.byStatus?.Lost ?? 0;

  const conversionRate = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;

  const newShare = total > 0 ? (newCount / total) * 100 : 0;
  const contactedShare = total > 0 ? (contactedCount / total) * 100 : 0;
  const qualifiedShare = total > 0 ? (qualifiedCount / total) * 100 : 0;
  const lostShare = total > 0 ? (lostCount / total) * 100 : 0;

  const cards: Array<{
    title: string;
    key: string;
    statusValue: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgTint: string;
    activeBorder: string;
    indicatorColor: string;
  }> = [
    {
      title: 'Total Pipeline',
      key: 'all',
      statusValue: 'All',
      count: total,
      icon: Users,
      accentColor: 'text-indigo-600 bg-indigo-100/70',
      bgTint: 'from-white to-indigo-50/20',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md',
      indicatorColor: 'bg-indigo-600',
    },
    {
      title: 'New Inquiries',
      key: 'new',
      statusValue: 'New',
      count: newCount,
      icon: Sparkles,
      accentColor: 'text-blue-600 bg-blue-100/70',
      bgTint: 'from-white to-blue-50/20',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20 shadow-md',
      indicatorColor: 'bg-blue-500',
    },
    {
      title: 'Contacted',
      key: 'contacted',
      statusValue: 'Contacted',
      count: contactedCount,
      icon: Clock,
      accentColor: 'text-amber-600 bg-amber-100/70',
      bgTint: 'from-white to-amber-50/20',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/20 shadow-md',
      indicatorColor: 'bg-amber-500',
    },
    {
      title: 'Qualified',
      key: 'qualified',
      statusValue: 'Qualified',
      count: qualifiedCount,
      icon: CheckCircle2,
      accentColor: 'text-emerald-600 bg-emerald-100/70',
      bgTint: 'from-white to-emerald-50/20',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-md',
      indicatorColor: 'bg-emerald-500',
    },
    {
      title: 'Closed / Lost',
      key: 'lost',
      statusValue: 'Lost',
      count: lostCount,
      icon: XCircle,
      accentColor: 'text-rose-600 bg-rose-100/70',
      bgTint: 'from-white to-rose-50/20',
      activeBorder: 'border-rose-600 ring-2 ring-rose-500/20 shadow-md',
      indicatorColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="mb-6 space-y-3.5">
      {/* Top Banner KPI Header with Pipeline Distribution Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Pipeline Velocity & Health
            </h2>
            <p className="text-xs text-slate-400">
              {total} active opportunities across all stages
            </p>
          </div>
        </div>

        {/* Visual Pipeline Funnel Segmented Bar */}
        <div className="flex-1 max-w-md hidden lg:block px-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>Stage Distribution</span>
            <span>{conversionRate}% Conversion Rate</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex shadow-2xs">
            <div style={{ width: `${newShare}%` }} className="bg-blue-500 transition-all duration-500" title={`New: ${newCount}`} />
            <div style={{ width: `${contactedShare}%` }} className="bg-amber-500 transition-all duration-500" title={`Contacted: ${contactedCount}`} />
            <div style={{ width: `${qualifiedShare}%` }} className="bg-emerald-500 transition-all duration-500" title={`Qualified: ${qualifiedCount}`} />
            <div style={{ width: `${lostShare}%` }} className="bg-rose-500 transition-all duration-500" title={`Lost: ${lostCount}`} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="inline-flex items-center space-x-1.5 bg-emerald-50/80 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200/70 text-xs font-bold shadow-2xs">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>{conversionRate}% Conversion</span>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedStatus === card.statusValue;
          const share =
            card.statusValue === 'All'
              ? 100
              : total > 0
              ? Math.round((card.count / total) * 100)
              : 0;

          return (
            <button
              key={card.key}
              type="button"
              onClick={() => onSelectStatus(card.statusValue)}
              className={`text-left p-4 rounded-2xl border bg-gradient-to-b ${card.bgTint} transition-all duration-200 relative overflow-hidden group cursor-pointer shadow-xs ${
                isSelected
                  ? card.activeBorder
                  : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Top Accent Strip */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                  isSelected ? 'bg-indigo-600' : card.indicatorColor
                }`}
              />

              <div className="flex items-center justify-between mb-2.5 mt-0.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${card.accentColor} transition-transform group-hover:scale-110 shadow-2xs`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {isLoading ? '...' : card.count}
                </span>
                {card.statusValue !== 'All' && total > 0 && (
                  <span className="text-xs text-slate-400 font-bold">
                    {share}%
                  </span>
                )}
              </div>

              {/* Mini progress bar */}
              <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full ${
                    isSelected ? 'bg-indigo-600' : card.indicatorColor
                  } transition-all duration-500`}
                  style={{ width: `${share}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>{isSelected ? '✓ Filter active' : 'Click to filter'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
