import React from 'react';
import {
  Search,
  X,
  RotateCcw,
  Filter,
  Download,
  LayoutList,
  Columns3,
} from 'lucide-react';

export type ViewMode = 'table' | 'kanban';

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
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onExportCSV: () => void;
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All Statuses' },
  { value: 'New', label: 'New Inquiries' },
  { value: 'Contacted', label: 'In Contact' },
  { value: 'Qualified', label: 'Qualified' },
  { value: 'Lost', label: 'Closed / Lost' },
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
  viewMode,
  onViewModeChange,
  onExportCSV,
}) => {
  const hasActiveFilters = search.trim() !== '' || status !== 'All' || source !== 'All';

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-5 space-y-3">
      {/* Top Controls Row */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search Input with Shortcut badge */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            id="global-lead-search"
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search leads by name, email, company, or phone..."
            className="w-full pl-10 pr-20 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1.5">
            {search ? (
              <button
                onClick={() => onSearchChange('')}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded shadow-xs">
                /
              </kbd>
            )}
          </div>
        </div>

        {/* Action Buttons & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Dropdown */}
          <div className="relative min-w-[140px]">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="relative min-w-[135px]">
            <select
              value={source}
              onChange={(e) => onSourceChange(e.target.value)}
              className="w-full text-xs font-semibold py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SOURCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle (Table vs Kanban) */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('kanban')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Pipeline Board View"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={onExportCSV}
            title="Export leads to CSV"
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            <span className="hidden sm:inline">Export</span>
          </button>

          {/* Refresh Data Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Refresh list"
            className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Filter Chips & Summary */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-slate-700 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Showing <strong className="text-slate-900">{totalResults}</strong> {totalResults === 1 ? 'lead' : 'leads'}
            </span>
          </div>

          {/* Filter badges */}
          {status !== 'All' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Status: {status}
              <button
                onClick={() => onStatusChange('All')}
                className="ml-1 text-indigo-400 hover:text-indigo-700"
              >
                ×
              </button>
            </span>
          )}

          {source !== 'All' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Source: {source}
              <button
                onClick={() => onSourceChange('All')}
                className="ml-1 text-indigo-400 hover:text-indigo-700"
              >
                ×
              </button>
            </span>
          )}

          {search.trim() !== '' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Query: "{search}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 text-indigo-400 hover:text-indigo-700"
              >
                ×
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
};
