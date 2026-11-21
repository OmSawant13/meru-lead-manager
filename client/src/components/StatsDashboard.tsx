import React from 'react';
import { LeadStats } from '../types';
import { Users, Clock, CheckCircle2, XCircle, Sparkles, TrendingUp } from 'lucide-react';

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
  const qualified = stats?.byStatus?.Qualified ?? 0;
  const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

  const cards: Array<{
    title: string;
    key: string;
    statusValue: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    cardBorder: string;
    badgeStyle: string;
    indicatorColor: string;
  }> = [
    {
      title: 'Total Pipeline',
      key: 'all',
      statusValue: 'All',
      count: total,
      icon: Users,
      accentColor: 'text-indigo-600 bg-indigo-50/80',
      cardBorder: 'hover:border-indigo-300',
      badgeStyle: 'bg-indigo-50 text-indigo-700',
      indicatorColor: 'bg-indigo-500',
    },
    {
      title: 'New Inquiries',
      key: 'new',
      statusValue: 'New',
      count: stats?.byStatus?.New ?? 0,
      icon: Sparkles,
      accentColor: 'text-blue-600 bg-blue-50/80',
      cardBorder: 'hover:border-blue-300',
      badgeStyle: 'bg-blue-50 text-blue-700',
      indicatorColor: 'bg-blue-500',
    },
    {
      title: 'Contacted',
      key: 'contacted',
      statusValue: 'Contacted',
      count: stats?.byStatus?.Contacted ?? 0,
      icon: Clock,
      accentColor: 'text-amber-600 bg-amber-50/80',
      cardBorder: 'hover:border-amber-300',
      badgeStyle: 'bg-amber-50 text-amber-700',
      indicatorColor: 'bg-amber-500',
    },
    {
      title: 'Qualified',
      key: 'qualified',
      statusValue: 'Qualified',
      count: qualified,
      icon: CheckCircle2,
      accentColor: 'text-emerald-600 bg-emerald-50/80',
      cardBorder: 'hover:border-emerald-300',
      badgeStyle: 'bg-emerald-50 text-emerald-700',
      indicatorColor: 'bg-emerald-500',
    },
    {
      title: 'Closed / Lost',
      key: 'lost',
      statusValue: 'Lost',
      count: stats?.byStatus?.Lost ?? 0,
      icon: XCircle,
      accentColor: 'text-rose-600 bg-rose-50/80',
      cardBorder: 'hover:border-rose-300',
      badgeStyle: 'bg-rose-50 text-rose-700',
      indicatorColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="mb-6 space-y-3">
      {/* Top Banner KPI Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-1 gap-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            Pipeline Analytics
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold border border-slate-200">
            Live Metrics
          </span>
        </div>

        <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Conversion Rate: {conversionRate}%</span>
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
              className={`text-left p-4 rounded-2xl border bg-white transition-all duration-200 relative overflow-hidden group cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-md bg-gradient-to-b from-white to-indigo-50/20'
                  : `border-slate-200/80 ${card.cardBorder} hover:shadow-md hover:-translate-y-0.5`
              }`}
            >
              {/* Status Indicator Bar at Top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 transition-all ${
                  isSelected ? 'bg-indigo-600' : card.indicatorColor
                }`}
              />

              <div className="flex items-center justify-between mb-3 mt-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${card.accentColor} transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {isLoading ? '...' : card.count}
                </span>
                {card.statusValue !== 'All' && total > 0 && (
                  <span className="text-xs text-slate-400 font-semibold">
                    {share}%
                  </span>
                )}
              </div>

              {/* Progress mini-bar */}
              <div className="mt-3 w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full ${
                    isSelected ? 'bg-indigo-600' : card.indicatorColor
                  }`}
                  style={{ width: `${share}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <span>{isSelected ? '✓ Filter active' : 'Click to isolate'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
