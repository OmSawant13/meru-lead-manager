import React from 'react';
import { Lead, LeadStatus } from '../types';
import { getSourceIcon } from './LeadDrawer';
import {
  Edit2,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building2,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  Eye,
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
}

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles: Record<LeadStatus, { bg: string; dot: string }> = {
    New: {
      bg: 'bg-blue-50 border-blue-200/80 text-blue-700',
      dot: 'bg-blue-500',
    },
    Contacted: {
      bg: 'bg-amber-50 border-amber-200/80 text-amber-700',
      dot: 'bg-amber-500',
    },
    Qualified: {
      bg: 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
      dot: 'bg-emerald-500',
    },
    Lost: {
      bg: 'bg-rose-50 border-rose-200/80 text-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const current = styles[status] || styles.New;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-2xs ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${current.dot} animate-pulse`}></span>
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
}) => {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-300 group-hover:text-slate-500" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-600" />
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

  if (isLoading && leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
          <div className="h-14 bg-slate-50 rounded-xl w-full"></div>
          <div className="h-14 bg-slate-50 rounded-xl w-full"></div>
          <div className="h-14 bg-slate-50 rounded-xl w-full"></div>
          <div className="h-14 bg-slate-50 rounded-xl w-full"></div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-50 to-indigo-100/80 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-200/60 shadow-xs">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No leads match your criteria</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Try clearing your search query or filters, or capture a new lead into your sales pipeline.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all cursor-pointer"
        >
          Capture New Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Contact & Lead
                  {renderSortIcon('name')}
                </button>
              </th>
              <th className="py-3.5 px-4 hidden md:table-cell">
                <button
                  type="button"
                  onClick={() => onSort('company')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Company
                  {renderSortIcon('company')}
                </button>
              </th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Source</th>
              <th className="py-3.5 px-4">
                <button
                  type="button"
                  onClick={() => onSort('status')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Pipeline Status
                  {renderSortIcon('status')}
                </button>
              </th>
              <th className="py-3.5 px-4 hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => onSort('createdAt')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Captured On
                  {renderSortIcon('createdAt')}
                </button>
              </th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onSelectLead(lead)}
                className="hover:bg-indigo-50/30 transition-all group cursor-pointer"
              >
                {/* Lead Name & Avatar */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs flex-shrink-0 group-hover:from-indigo-600 group-hover:to-violet-600 group-hover:text-white transition-all shadow-2xs">
                      {getInitials(lead.name)}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                        {lead.name}
                      </span>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5 text-xs text-slate-500">
                        <span className="inline-flex items-center truncate">
                          <Mail className="w-3 h-3 mr-1 text-slate-400" />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="inline-flex items-center truncate hidden sm:inline-flex">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            {lead.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td className="py-4 px-4 hidden md:table-cell text-slate-700">
                  {lead.company ? (
                    <div className="flex items-center text-slate-800 font-medium">
                      <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      <span className="truncate max-w-[170px]">{lead.company}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">—</span>
                  )}
                </td>

                {/* Source */}
                <td className="py-4 px-4 hidden lg:table-cell">
                  <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-slate-100/80 text-slate-700 rounded-lg border border-slate-200/60">
                    <span className="mr-1.5">{getSourceIcon(lead.source)}</span>
                    {lead.source}
                  </span>
                </td>

                {/* Status + Quick Switch Dropdown */}
                <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center space-x-2">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        onStatusChange(lead, e.target.value as LeadStatus)
                      }
                      className="text-xs font-bold py-1.5 px-3 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
                    >
                      <option value="New">🔵 New</option>
                      <option value="Contacted">🟡 Contacted</option>
                      <option value="Qualified">🟢 Qualified</option>
                      <option value="Lost">🔴 Lost</option>
                    </select>
                  </div>
                </td>

                {/* Created Date */}
                <td className="py-4 px-4 hidden sm:table-cell text-xs text-slate-500">
                  <div className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {formatDate(lead.createdAt)}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-4 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onSelectLead(lead)}
                      title="View Full Profile"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(lead)}
                      title="Edit Lead"
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      title="Delete Lead"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
