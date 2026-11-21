import React, { useState } from 'react';
import { Lead, LeadStatus, ViewMode } from '../types';
import { getSourceIcon } from './LeadDrawer';
import { useTheme } from '../context/ThemeContext';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Calendar,
  Sparkles,
  Eye,
  ChevronDown,
  LayoutList,
  Columns3,
  Download,
} from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: any) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (lead: Lead, newStatus: LeadStatus) => void;
  onOpenCreateModal: () => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  onExportCSV: () => void;
  totalCount: number;
}

const AVATAR_GRADIENTS = [
  'from-indigo-500 to-violet-600 text-white shadow-indigo-500/20',
  'from-emerald-500 to-teal-600 text-white shadow-emerald-500/20',
  'from-blue-500 to-cyan-600 text-white shadow-blue-500/20',
  'from-amber-500 to-orange-600 text-white shadow-amber-500/20',
  'from-rose-500 to-pink-600 text-white shadow-rose-500/20',
  'from-purple-500 to-indigo-600 text-white shadow-purple-500/20',
];

const getAvatarGradient = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles: Record<LeadStatus, { bg: string; text: string; dot: string; border: string }> = {
    New: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      dot: 'bg-blue-400 shadow-blue-400/50',
    },
    Contacted: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      dot: 'bg-amber-400 shadow-amber-400/50',
    },
    Qualified: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400 shadow-emerald-400/50',
    },
    Lost: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/30',
      dot: 'bg-rose-400 shadow-rose-400/50',
    },
  };

  const current = styles[status] || styles.New;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black border ${current.bg} ${current.text} ${current.border} shadow-2xs transition-all duration-200`}
    >
      <span className={`w-2 h-2 rounded-full mr-1.5 ${current.dot} shadow-sm animate-pulse`}></span>
      {status}
    </span>
  );
};

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
  onSelectLead,
  onStatusChange,
  onOpenCreateModal,
  viewMode,
  onViewModeChange,
  onExportCSV,
  totalCount,
}) => {
  const { isDark } = useTheme();
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'priority' | 'today'>('all');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(leads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleOne = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <ArrowUpDown
          className={`w-3.5 h-3.5 ml-1 transition-colors ${
            isDark ? 'text-slate-600 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-slate-500'
          }`}
        />
      );
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-500" />
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const allSelected = leads.length > 0 && selectedLeadIds.length === leads.length;

  return (
    <div className="space-y-4">
      {/* Leads Header Row with Tabs and View Switchers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        {/* Left: Title + Tabs */}
        <div className="flex items-center space-x-6">
          <h2 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Leads
          </h2>

          {/* Sub-tabs with Smooth Active Pills */}
          <div className="flex items-center space-x-1 sm:space-x-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>All Leads</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'all'
                    ? 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('my')}
              className={`hidden sm:flex px-3.5 py-2 rounded-xl transition-all duration-300 items-center space-x-1.5 cursor-pointer ${
                activeTab === 'my'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>My Leads</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'my'
                    ? 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {Math.min(5, totalCount)}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('priority')}
              className={`hidden md:flex px-3.5 py-2 rounded-xl transition-all duration-300 items-center space-x-1.5 cursor-pointer ${
                activeTab === 'priority'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>High Priority</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'priority'
                    ? 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </span>
            </button>

            <button
              onClick={() => setActiveTab('today')}
              className={`hidden lg:flex px-3.5 py-2 rounded-xl transition-all duration-300 items-center space-x-1.5 cursor-pointer ${
                activeTab === 'today'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-md shadow-indigo-500/25 scale-[1.02]'
                  : isDark
                  ? 'text-slate-400 hover:text-white hover:bg-white/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <span>Due Today</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'today'
                    ? 'bg-white/20 text-white'
                    : isDark
                    ? 'bg-white/10 text-slate-300'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </span>
            </button>
          </div>
        </div>

        {/* Right: Table/Pipeline switcher & Export button */}
        <div className="flex items-center space-x-2.5">
          <div
            className={`flex items-center p-1 rounded-2xl border shadow-2xs ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100/90 border-slate-200/80'
            }`}
          >
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
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
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Pipeline Board View"
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span>Pipeline</span>
            </button>
          </div>

          <button
            onClick={onExportCSV}
            title="Export leads to CSV"
            className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-2xl border transition-all duration-200 shadow-2xs cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
            }`}
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Table Container with Ultra-Smooth Rounded Island Card */}
      {isLoading && leads.length === 0 ? (
        <div
          className={`rounded-3xl border overflow-hidden p-8 ${
            isDark ? 'bento-card' : 'bento-card-light'
          }`}
        >
          <div className="space-y-4 animate-pulse">
            <div className={`h-10 rounded-2xl w-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}></div>
            <div className={`h-14 rounded-2xl w-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}></div>
            <div className={`h-14 rounded-2xl w-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}></div>
            <div className={`h-14 rounded-2xl w-full ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}></div>
          </div>
        </div>
      ) : leads.length === 0 ? (
        <div
          className={`rounded-3xl border p-12 text-center shadow-xl ${
            isDark ? 'bento-card' : 'bento-card-light'
          }`}
        >
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500/20 to-violet-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          <h3 className={`text-lg font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            No leads match your criteria
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
            Try adjusting your search filters or capture a new lead into your sales pipeline.
          </p>
          <button
            onClick={onOpenCreateModal}
            className="btn-neon inline-flex items-center px-5 py-2.5 text-xs font-bold text-white rounded-2xl cursor-pointer"
          >
            Capture New Lead
          </button>
        </div>
      ) : (
        <div
          className={`rounded-3xl border shadow-xl overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-[#111728]/85 backdrop-blur-xl border-white/10'
              : 'bg-white/95 backdrop-blur-xl border-slate-200/90'
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                    isDark
                      ? 'bg-[#151d33]/80 border-white/10 text-slate-400'
                      : 'bg-slate-50/90 border-slate-200/80 text-slate-500'
                  }`}
                >
                  {/* Select All Checkbox */}
                  <th className="py-4 pl-4 sm:pl-6 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded-md text-indigo-600 border-slate-400/50 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all duration-200"
                    />
                  </th>
                  <th className="py-4 px-3">
                    <button
                      type="button"
                      onClick={() => onSort('name')}
                      className="group inline-flex items-center focus:outline-none"
                    >
                      <span>CONTACT & LEAD</span>
                      {renderSortIcon('name')}
                    </button>
                  </th>
                  <th className="py-4 px-3 hidden md:table-cell">
                    <button
                      type="button"
                      onClick={() => onSort('company')}
                      className="group inline-flex items-center focus:outline-none"
                    >
                      <span>COMPANY</span>
                      {renderSortIcon('company')}
                    </button>
                  </th>
                  <th className="py-4 px-3 hidden lg:table-cell">SOURCE</th>
                  <th className="py-4 px-3">
                    <button
                      type="button"
                      onClick={() => onSort('status')}
                      className="group inline-flex items-center focus:outline-none"
                    >
                      <span>PIPELINE STATUS</span>
                      {renderSortIcon('status')}
                    </button>
                  </th>
                  <th className="py-4 px-3 hidden sm:table-cell">
                    <button
                      type="button"
                      onClick={() => onSort('createdAt')}
                      className="group inline-flex items-center focus:outline-none"
                    >
                      <span>CAPTURED ON</span>
                      {renderSortIcon('createdAt')}
                    </button>
                  </th>
                  <th className="py-4 pr-4 sm:pr-6 pl-3 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y text-sm font-medium ${
                  isDark ? 'divide-white/5 text-slate-200' : 'divide-slate-100 text-slate-700'
                }`}
              >
                {leads.map((lead) => {
                  const avatarClass = getAvatarGradient(lead.name);
                  const isChecked = selectedLeadIds.includes(lead.id);

                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className={`transition-colors duration-200 group cursor-pointer ${
                        isChecked
                          ? isDark
                            ? 'bg-indigo-500/15'
                            : 'bg-indigo-50/50'
                          : isDark
                          ? 'hover:bg-white/[0.04]'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* Row Checkbox */}
                      <td
                        className="py-4 pl-4 sm:pl-6 pr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleOne(lead.id)}
                          className="w-4 h-4 rounded-md text-indigo-600 border-slate-400/50 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer transition-all duration-200"
                        />
                      </td>

                      {/* Lead Name & Avatar */}
                      <td className="py-4 px-3">
                        <div className="flex items-center space-x-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${avatarClass} flex items-center justify-center font-black text-xs flex-shrink-0 shadow-md ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110`}
                          >
                            {getInitials(lead.name)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span
                              className={`font-bold tracking-tight text-sm transition-colors duration-200 truncate ${
                                isDark
                                  ? 'text-white group-hover:text-indigo-400'
                                  : 'text-slate-900 group-hover:text-indigo-600'
                              }`}
                            >
                              {lead.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                              {lead.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="py-4 px-3 hidden md:table-cell">
                        {lead.company ? (
                          <div className="flex items-center font-semibold text-xs">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center mr-2 flex-shrink-0 border ${
                                isDark
                                  ? 'bg-white/5 border-white/10 text-slate-400'
                                  : 'bg-slate-100 border-slate-200/80 text-slate-500'
                              }`}
                            >
                              <Building2 className="w-3.5 h-3.5" />
                            </div>
                            <span
                              className={`truncate max-w-[170px] ${
                                isDark ? 'text-slate-300' : 'text-slate-800'
                              }`}
                            >
                              {lead.company}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-xs">—</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-3 hidden lg:table-cell">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-xl border shadow-2xs ${
                            isDark
                              ? 'bg-white/5 text-slate-300 border-white/10'
                              : 'bg-slate-100 text-slate-700 border-slate-200/70'
                          }`}
                        >
                          <span className="mr-1.5">{getSourceIcon(lead.source)}</span>
                          {lead.source}
                        </span>
                      </td>

                      {/* Status Dropdown with Custom Appearance */}
                      <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              onStatusChange(lead, e.target.value as LeadStatus)
                            }
                            className={`text-xs font-black py-1.5 pl-3 pr-8 rounded-xl border cursor-pointer appearance-none transition-all duration-200 shadow-2xs focus:outline-none focus:ring-4 focus:ring-indigo-500/20 ${
                              isDark
                                ? lead.status === 'Qualified'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                  : lead.status === 'Contacted'
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                  : lead.status === 'Lost'
                                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : lead.status === 'Qualified'
                                ? 'border-emerald-200 text-emerald-800 bg-emerald-50/80'
                                : lead.status === 'Contacted'
                                ? 'border-amber-200 text-amber-800 bg-amber-50/80'
                                : lead.status === 'Lost'
                                ? 'border-rose-200 text-rose-800 bg-rose-50/80'
                                : 'border-blue-200 text-blue-800 bg-blue-50/80'
                            }`}
                          >
                            <option value="New" className={isDark ? 'bg-slate-900 text-white' : ''}>● New</option>
                            <option value="Contacted" className={isDark ? 'bg-slate-900 text-white' : ''}>● Contacted</option>
                            <option value="Qualified" className={isDark ? 'bg-slate-900 text-white' : ''}>● Qualified</option>
                            <option value="Lost" className={isDark ? 'bg-slate-900 text-white' : ''}>● Lost</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-3 hidden sm:table-cell text-xs text-slate-400">
                        <div className="flex items-center font-medium">
                          <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>

                      {/* Actions with Smooth Pill Menu on Hover */}
                      <td
                        className="py-4 pr-4 sm:pr-6 pl-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onSelectLead(lead)}
                            title="View Full Profile"
                            className={`p-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer shadow-2xs ${
                              isDark
                                ? 'text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-slate-200'
                            }`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(lead)}
                            title="Edit Lead"
                            className={`p-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer shadow-2xs ${
                              isDark
                                ? 'text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/10'
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-slate-200'
                            }`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(lead)}
                            title="Delete Lead"
                            className={`p-1.5 rounded-xl border border-transparent transition-all duration-200 cursor-pointer shadow-2xs ${
                              isDark
                                ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20'
                                : 'text-slate-400 hover:text-rose-600 hover:bg-white hover:border-rose-200'
                            }`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
