import React from 'react';
import { Search, X, RotateCcw, Filter } from 'lucide-react';

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  isLoading: boolean;
  totalResults: number;
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Statuses' },
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Lost' },
];

const SOURCE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Sources' },
  { value: 'Website', label: 'Website' },
  { value: 'Referral', label: 'Referral' },
  { value: 'Cold Outreach', label: 'Cold Outreach' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Advertisement', label: 'Advertisement' },
  { value: 'Event', label: 'Event' },
  { value: 'Other', label: 'Other' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  source,
  onSourceChange,
  onResetFilters,
  onRefresh,
  isLoading,
  totalResults,
}) => {
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || source !== 'All';

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-4 space-y-3">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, company, or phone..."
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Filter */}
          <div className="relative min-w-[140px]">
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full text-sm py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Reset
            </button>
          )}

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh list"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter summary status line */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>
            Showing <strong className="text-slate-800">{totalResults}</strong> matching{' '}
            {totalResults === 1 ? 'lead' : 'leads'}
          </span>
          {hasActiveFilters && (
            <span className="text-indigo-600 font-medium">(Filtered)</span>
          )}
        </div>
      </div>
    </div>
  );
};
