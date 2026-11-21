import React from 'react';
import { Lead, LeadStatus } from '../types';
import { getSourceIcon } from './LeadDrawer';
import {
  Building2,
  Mail,
  ArrowRight,
  ArrowLeft,
  Plus,
} from 'lucide-react';

interface KanbanBoardProps {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: LeadStatus) => void;
  onOpenCreateModal: () => void;
}

const COLUMNS: Array<{
  status: LeadStatus;
  title: string;
  badgeBg: string;
  badgeText: string;
  columnBg: string;
  borderColor: string;
}> = [
  {
    status: 'New',
    title: 'New Inquiries',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    columnBg: 'bg-blue-50/30',
    borderColor: 'border-blue-200/60',
  },
  {
    status: 'Contacted',
    title: 'In Outreach',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    columnBg: 'bg-amber-50/30',
    borderColor: 'border-amber-200/60',
  },
  {
    status: 'Qualified',
    title: 'Qualified Deals',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    columnBg: 'bg-emerald-50/30',
    borderColor: 'border-emerald-200/60',
  },
  {
    status: 'Lost',
    title: 'Closed / Lost',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    columnBg: 'bg-rose-50/30',
    borderColor: 'border-rose-200/60',
  },
];

const STAGE_ORDER: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  isLoading,
  onSelectLead,
  onStatusChange,
  onOpenCreateModal,
}) => {
  if (isLoading && leads.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 rounded-2xl bg-slate-100 border border-slate-200/60" />
        ))}
      </div>
    );
  }

  const getNextStage = (curr: LeadStatus): LeadStatus | null => {
    const idx = STAGE_ORDER.indexOf(curr);
    return idx < STAGE_ORDER.length - 1 ? STAGE_ORDER[idx + 1] : null;
  };

  const getPrevStage = (curr: LeadStatus): LeadStatus | null => {
    const idx = STAGE_ORDER.indexOf(curr);
    return idx > 0 ? STAGE_ORDER[idx - 1] : null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => l.status === col.status);

        return (
          <div
            key={col.status}
            className={`rounded-2xl border ${col.borderColor} ${col.columnBg} p-4 flex flex-col min-h-[500px]`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/60">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-800 text-sm tracking-tight">
                  {col.title}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${col.badgeBg} ${col.badgeText}`}
                >
                  {columnLeads.length}
                </span>
              </div>
              {col.status === 'New' && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-md transition-colors"
                  title="Add lead to this stage"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3 flex-1">
              {columnLeads.length === 0 ? (
                <div className="h-32 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <span className="text-xs">No leads in this stage</span>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const nextStage = getNextStage(lead.status);
                  const prevStage = getPrevStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group relative"
                    >
                      {/* Name & Source */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                          {lead.name}
                        </h4>
                        <span
                          className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 flex-shrink-0"
                          title={`Source: ${lead.source}`}
                        >
                          <span className="mr-1">{getSourceIcon(lead.source)}</span>
                          {lead.source}
                        </span>
                      </div>

                      {/* Company */}
                      {lead.company && (
                        <div className="flex items-center text-xs text-slate-600 mb-2 font-medium">
                          <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}

                      {/* Email */}
                      <div className="flex items-center text-xs text-slate-500 mb-3 truncate">
                        <Mail className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg line-clamp-2 mb-3 border border-slate-100 italic">
                          "{lead.notes}"
                        </p>
                      )}

                      {/* Stage Movement Controls */}
                      <div
                        className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          {prevStage ? (
                            <button
                              onClick={() => onStatusChange(lead, prevStage)}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors inline-flex items-center text-[11px]"
                              title={`Move back to ${prevStage}`}
                            >
                              <ArrowLeft className="w-3.5 h-3.5 mr-0.5" />
                              <span>{prevStage}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300">Initial</span>
                          )}
                        </div>

                        <div>
                          {nextStage && (
                            <button
                              onClick={() => onStatusChange(lead, nextStage)}
                              className="p-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition-colors inline-flex items-center font-semibold text-[11px]"
                              title={`Advance to ${nextStage}`}
                            >
                              <span>{nextStage}</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
