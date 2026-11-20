import React from 'react';
import { Lead, LeadStatus } from '../types';
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
} from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSort: (field: any) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange: (lead: Lead, newStatus: LeadStatus) => void;
  onOpenCreateModal: () => void;
}

export const StatusBadge: React.FC<{ status: LeadStatus }> = ({ status }) => {
  const styles: Record<LeadStatus, { bg: string; dot: string }> = {
    New: {
      bg: 'bg-blue-50 border-blue-200 text-blue-700',
      dot: 'bg-blue-500',
    },
    Contacted: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
    },
    Qualified: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      dot: 'bg-emerald-500',
    },
    Lost: {
      bg: 'bg-rose-50 border-rose-200 text-rose-700',
      dot: 'bg-rose-500',
    },
  };

  const current = styles[status] || styles.New;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${current.dot}`}></span>
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
  onStatusChange,
  onOpenCreateModal,
}) => {
  const renderSortIcon = (field: string) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:text-slate-600" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1 text-indigo-600" />
    );
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm p-8">
        <div className="space-y-4 animate-pulse">
          <div className="h-10 bg-slate-100 rounded w-full"></div>
          <div className="h-14 bg-slate-50 rounded w-full"></div>
          <div className="h-14 bg-slate-50 rounded w-full"></div>
          <div className="h-14 bg-slate-50 rounded w-full"></div>
          <div className="h-14 bg-slate-50 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">No leads found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          There are no leads matching your current filters or search query. Try adjusting your search or add a new lead.
        </p>
        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
        >
          Add New Lead
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => onSort('name')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Lead Name
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
                  Status
                  {renderSortIcon('status')}
                </button>
              </th>
              <th className="py-3.5 px-4 hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => onSort('createdAt')}
                  className="group inline-flex items-center focus:outline-none"
                >
                  Added Date
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
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Lead Name & Contact info */}
                <td className="py-4 px-4 sm:px-6">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {lead.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500">
                      <a
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center hover:text-indigo-600 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="inline-flex items-center hover:text-indigo-600 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td className="py-4 px-4 hidden md:table-cell text-slate-700">
                  {lead.company ? (
                    <div className="flex items-center text-slate-800">
                      <Building2 className="w-4 h-4 mr-1.5 text-slate-400" />
                      <span className="truncate max-w-[180px]">{lead.company}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-xs">—</span>
                  )}
                </td>

                {/* Source */}
                <td className="py-4 px-4 hidden lg:table-cell">
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
                    {lead.source}
                  </span>
                </td>

                {/* Status + Quick Switch Dropdown */}
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        onStatusChange(lead, e.target.value as LeadStatus)
                      }
                      className="text-xs font-semibold py-1 px-2.5 rounded-full border border-slate-200 bg-white shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Lost">Lost</option>
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
                <td className="py-4 px-4 sm:px-6 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEdit(lead)}
                      title="Edit Lead"
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(lead)}
                      title="Delete Lead"
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
