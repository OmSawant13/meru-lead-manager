import React from 'react';
import {
  Search,
  X,
  Filter,
} from 'lucide-react';

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
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || source !== 'All';

  return (
    <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-xs mb-3 space-y-2">
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
            className="w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
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
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
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
              className="w-full text-xs font-semibold py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer shadow-2xs"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
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
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors text-xs font-bold"
            >
              Clear
            </button>
          ) : (
            <div className="p-2 text-slate-400 border border-slate-200 rounded-xl bg-slate-50 shadow-2xs">
              <Filter className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
