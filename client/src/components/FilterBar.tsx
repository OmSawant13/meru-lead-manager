import React from 'react';
import {
  Search,
  X,
  Filter,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Statuses' },
  { value: 'New', label: '🔵 New Inquiries' },
  { value: 'Contacted', label: '🟡 Contacted' },
  { value: 'Qualified', label: '🟢 Qualified' },
  { value: 'Lost', label: '🔴 Closed / Lost' },
];

const SOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Sources' },
  { value: 'Website', label: '🌐 Website' },
  { value: 'Referral', label: '🤝 Referral' },
  { value: 'Cold Outreach', label: '✉️ Cold Outreach' },
  { value: 'LinkedIn', label: '💼 LinkedIn' },
  { value: 'Advertisement', label: '📢 Advertisement' },
  { value: 'Event', label: '🎟️ Event' },
  { value: 'Other', label: '✨ Other' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onResetFilters,
}) => {
  const { isDark } = useTheme();
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || source !== 'All';

  return (
    <div
      className={`p-3.5 rounded-[24px] mb-3 space-y-2 border transition-all duration-300 ${
        isDark ? 'bento-card' : 'bento-card-light'
      }`}
    >
      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="global-lead-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, company..."
            className={`w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-[#1a2136] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                : 'bg-slate-50/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
            }`}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative min-w-[135px]">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`w-full text-xs font-bold py-2.5 px-3 rounded-2xl border cursor-pointer shadow-2xs transition-all ${
                isDark
                  ? 'bg-[#182033] border-white/10 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-slate-900 text-white' : ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className={`w-full text-xs font-bold py-2.5 px-3 rounded-2xl border cursor-pointer shadow-2xs transition-all ${
                isDark
                  ? 'bg-[#182033] border-white/10 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-slate-900 text-white' : ''}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset or Filter Icon */}
          {hasActiveFilters ? (
            <button
              onClick={onResetFilters}
              title="Clear all filters"
              className="px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-2xl border border-rose-500/30 transition-colors text-xs font-extrabold cursor-pointer"
            >
              Clear
            </button>
          ) : (
            <div
              className={`p-2.5 rounded-2xl border shadow-2xs ${
                isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <Filter className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
