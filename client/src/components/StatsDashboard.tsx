import React from 'react';
import { LeadStats } from '../types';
import { Users, Clock, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

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
  const cards: Array<{
    title: string;
    key: string;
    statusValue: string;
    count: number;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgHover: string;
    ringColor: string;
    badgeStyle: string;
  }> = [
    {
      title: 'Total Leads',
      key: 'all',
      statusValue: 'All',
      count: stats?.total ?? 0,
      icon: Users,
      accentColor: 'text-indigo-600 bg-indigo-50',
      bgHover: 'hover:border-indigo-300',
      ringColor: 'ring-indigo-600 border-indigo-600',
      badgeStyle: 'bg-indigo-50 text-indigo-700',
    },
    {
      title: 'New',
      key: 'new',
      statusValue: 'New',
      count: stats?.byStatus?.New ?? 0,
      icon: Sparkles,
      accentColor: 'text-blue-600 bg-blue-50',
      bgHover: 'hover:border-blue-300',
      ringColor: 'ring-blue-600 border-blue-600',
      badgeStyle: 'bg-blue-50 text-blue-700',
    },
    {
      title: 'Contacted',
      key: 'contacted',
      statusValue: 'Contacted',
      count: stats?.byStatus?.Contacted ?? 0,
      icon: Clock,
      accentColor: 'text-amber-600 bg-amber-50',
      bgHover: 'hover:border-amber-300',
      ringColor: 'ring-amber-600 border-amber-600',
      badgeStyle: 'bg-amber-50 text-amber-700',
    },
    {
      title: 'Qualified',
      key: 'qualified',
      statusValue: 'Qualified',
      count: stats?.byStatus?.Qualified ?? 0,
      icon: CheckCircle2,
      accentColor: 'text-emerald-600 bg-emerald-50',
      bgHover: 'hover:border-emerald-300',
      ringColor: 'ring-emerald-600 border-emerald-600',
      badgeStyle: 'bg-emerald-50 text-emerald-700',
    },
    {
      title: 'Lost',
      key: 'lost',
      statusValue: 'Lost',
      count: stats?.byStatus?.Lost ?? 0,
      icon: XCircle,
      accentColor: 'text-rose-600 bg-rose-50',
      bgHover: 'hover:border-rose-300',
      ringColor: 'ring-rose-600 border-rose-600',
      badgeStyle: 'bg-rose-50 text-rose-700',
    },
  ];

  const total = stats?.total ?? 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.statusValue;
        const percentage =
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
            className={`text-left p-4 rounded-xl border bg-white transition-all shadow-sm cursor-pointer relative overflow-hidden ${
              isSelected
                ? `ring-2 ${card.ringColor} shadow-md`
                : `border-slate-200 ${card.bgHover}`
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`p-2 rounded-lg ${card.accentColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-900">
                {isLoading ? '...' : card.count}
              </span>
              {card.statusValue !== 'All' && total > 0 && (
                <span className="text-xs text-slate-400 font-medium">
                  ({percentage}%)
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{isSelected ? '✓ Filter active' : 'Click to filter'}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
