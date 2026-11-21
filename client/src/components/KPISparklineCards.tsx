import React from 'react';
import { LeadStats } from '../types';
import { Layers, UserPlus, CheckCircle2, XCircle } from 'lucide-react';

interface KPISparklineCardsProps {
  stats: LeadStats | null;
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
  isLoading: boolean;
}

// Sparkline SVG Component with Gradient Fill
const Sparkline: React.FC<{
  color: string;
  gradientId: string;
  path: string;
}> = ({ color, gradientId, path }) => (
  <svg className="w-24 h-12 overflow-visible" viewBox="0 0 100 40">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path
      d={`${path} L 100 40 L 0 40 Z`}
      fill={`url(#${gradientId})`}
    />
    <path
      d={path}
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const KPISparklineCards: React.FC<KPISparklineCardsProps> = ({
  stats,
  selectedStatus = 'All',
  onSelectStatus,
  isLoading,
}) => {
  const total = stats?.total ?? 0;
  const newCount = stats?.byStatus?.New ?? 0;
  const qualifiedCount = stats?.byStatus?.Qualified ?? 0;
  const lostCount = stats?.byStatus?.Lost ?? 0;

  const newShare = total > 0 ? Math.round((newCount / total) * 100) : 0;
  const qualifiedShare = total > 0 ? Math.round((qualifiedCount / total) * 100) : 0;
  const lostShare = total > 0 ? Math.round((lostCount / total) * 100) : 0;

  const cards = [
    {
      title: 'Total Pipeline',
      statusValue: 'All',
      count: total,
      subText: 'vs. previous 30 days',
      badge: '↑ +33%',
      badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200/60',
      icon: Layers,
      iconBg: 'bg-indigo-50 text-indigo-600',
      sparklineColor: '#6366f1',
      gradientId: 'spark-total',
      path: 'M 0 32 Q 25 35, 45 20 T 80 10 T 100 8',
    },
    {
      title: 'New Inquiries',
      statusValue: 'New',
      count: newCount,
      percentage: `${newShare}%`,
      icon: UserPlus,
      iconBg: 'bg-blue-50 text-blue-600',
      sparklineColor: '#3b82f6',
      gradientId: 'spark-new',
      path: 'M 0 25 Q 30 35, 50 22 T 80 28 T 100 14',
    },
    {
      title: 'Qualified',
      statusValue: 'Qualified',
      count: qualifiedCount,
      percentage: `${qualifiedShare}%`,
      icon: CheckCircle2,
      iconBg: 'bg-emerald-50 text-emerald-600',
      sparklineColor: '#10b981',
      gradientId: 'spark-qualified',
      path: 'M 0 35 Q 25 32, 50 25 T 75 15 T 100 12',
    },
    {
      title: 'Closed / Lost',
      statusValue: 'Lost',
      count: lostCount,
      percentage: `${lostShare}%`,
      icon: XCircle,
      iconBg: 'bg-rose-50 text-rose-600',
      sparklineColor: '#f43f5e',
      gradientId: 'spark-lost',
      path: 'M 0 20 Q 30 18, 55 30 T 80 22 T 100 28',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.statusValue;

        return (
          <button
            key={card.title}
            type="button"
            onClick={() => onSelectStatus(card.statusValue)}
            className={`text-left bg-white p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden group cursor-pointer shadow-xs ${
              isSelected
                ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md bg-gradient-to-b from-white to-indigo-50/20'
                : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5'
            }`}
          >
            {/* Top row: Icon + Title */}
            <div className="flex items-center space-x-2.5 mb-3">
              <div
                className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                {card.title}
              </span>
            </div>

            {/* Bottom Row: Numbers & Sparkline */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    {isLoading ? '...' : card.count}
                  </span>
                  {card.percentage && (
                    <span className="text-xs font-bold text-slate-400">
                      {card.percentage}
                    </span>
                  )}
                </div>

                {card.badge && (
                  <div className="mt-2 flex items-center space-x-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${card.badgeColor}`}
                    >
                      {card.badge}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {card.subText}
                    </span>
                  </div>
                )}
              </div>

              {/* Sparkline Visual */}
              <div className="flex-shrink-0 pl-2">
                <Sparkline
                  color={card.sparklineColor}
                  gradientId={card.gradientId}
                  path={card.path}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
