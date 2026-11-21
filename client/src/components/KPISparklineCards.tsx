import React from 'react';
import { LeadStats } from '../types';
import { Layers, UserPlus, CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface KPISparklineCardsProps {
  stats: LeadStats | null;
  selectedStatus?: string;
  onSelectStatus: (status: string) => void;
  isLoading: boolean;
}

// Sparkline SVG Component with Glow & Gradient Fill
const Sparkline: React.FC<{
  color: string;
  gradientId: string;
  path: string;
}> = ({ color, gradientId, path }) => (
  <svg className="w-28 h-12 overflow-visible" viewBox="0 0 100 40">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.35" />
        <stop offset="100%" stopColor={color} stopOpacity="0.0" />
      </linearGradient>
      <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
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
      filter={`url(#glow-${gradientId})`}
    />
  </svg>
);

export const KPISparklineCards: React.FC<KPISparklineCardsProps> = ({
  stats,
  selectedStatus = 'All',
  onSelectStatus,
  isLoading,
}) => {
  const { isDark } = useTheme();

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
      subText: 'vs. prev 30 days',
      badge: '↑ +33%',
      badgeColor: isDark
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      icon: Layers,
      iconBg: isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600',
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
      iconBg: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600',
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
      iconBg: isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600',
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
      iconBg: isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-50 text-rose-600',
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
            className={`text-left p-5 rounded-[26px] relative overflow-hidden group cursor-pointer ${
              isDark ? 'bento-card' : 'bento-card-light'
            } ${
              isSelected
                ? 'border-indigo-500 ring-4 ring-indigo-500/25 shadow-xl shadow-indigo-500/15'
                : ''
            }`}
          >
            {/* Top row: Icon + Title */}
            <div className="flex items-center space-x-2.5 mb-3.5">
              <div
                className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0 shadow-2xs transition-transform duration-300 group-hover:scale-110`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold tracking-tight ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {card.title}
              </span>
            </div>

            {/* Bottom Row: Count & Sparkline */}
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isLoading ? '...' : card.count}
                  </span>
                  {card.percentage && (
                    <span className="text-xs font-bold text-slate-400">
                      {card.percentage}
                    </span>
                  )}
                </div>

                {card.badge && (
                  <div className="mt-2.5 flex items-center space-x-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${card.badgeColor}`}
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
