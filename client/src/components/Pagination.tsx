import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../types';
import { useTheme } from '../context/ThemeContext';

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onLimitChange,
}) => {
  const { isDark } = useTheme();
  const { page, totalPages, total, limit } = pagination;

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 px-3 py-2 text-xs font-medium rounded-2xl border transition-all ${
        isDark ? 'bg-white/5 border-white/10 text-slate-300' : 'bg-white border-slate-200/80 text-slate-600 shadow-2xs'
      }`}
    >
      {/* Items per page and count */}
      <div className="flex items-center space-x-3">
        <span>
          Showing <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{start}</span> to{' '}
          <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{end}</span> of{' '}
          <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{total}</span> results
        </span>

        <div className={`flex items-center space-x-1 pl-2 border-l ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <span className="text-slate-400 text-[11px]">Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className={`text-xs py-1 px-2 rounded-xl border font-bold cursor-pointer transition-all ${
              isDark
                ? 'bg-[#182035] border-white/10 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value={5} className={isDark ? 'bg-slate-900 text-white' : ''}>5</option>
            <option value={10} className={isDark ? 'bg-slate-900 text-white' : ''}>10</option>
            <option value={25} className={isDark ? 'bg-slate-900 text-white' : ''}>25</option>
            <option value={50} className={isDark ? 'bg-slate-900 text-white' : ''}>50</option>
          </select>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={!pagination.hasPrevPage}
          className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </button>

        <span className="text-xs font-bold text-slate-400 px-2">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={!pagination.hasNextPage}
          className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
            isDark
              ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
};
