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
  dotColor: string;
}> = [
  {
    status: 'New',
    title: 'New Inquiries',
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    columnBg: 'bg-blue-50/20',
    borderColor: 'border-blue-200/70',
    dotColor: 'bg-blue-500',
  },
  {
    status: 'Contacted',
    title: 'In Outreach',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-700',
    columnBg: 'bg-amber-50/20',
    borderColor: 'border-amber-200/70',
    dotColor: 'bg-amber-500',
  },
  {
    status: 'Qualified',
    title: 'Qualified Deals',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-700',
    columnBg: 'bg-emerald-50/20',
    borderColor: 'border-emerald-200/70',
    dotColor: 'bg-emerald-500',
  },
  {
    status: 'Lost',
    title: 'Closed / Lost',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-700',
    columnBg: 'bg-rose-50/20',
    borderColor: 'border-rose-200/70',
    dotColor: 'bg-rose-500',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-96 rounded-3xl bg-slate-100 border border-slate-200/60" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
      {COLUMNS.map((col) => {
        const columnLeads = leads.filter((l) => l.status === col.status);

        return (
          <div
            key={col.status}
            className={`rounded-3xl border ${col.borderColor} ${col.columnBg} p-4 sm:p-5 flex flex-col min-h-[520px] shadow-2xs transition-all duration-300`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/70">
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${col.dotColor} shadow-xs animate-pulse`} />
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  {col.title}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${col.badgeBg} ${col.badgeText} shadow-2xs`}
                >
                  {columnLeads.length}
                </span>
              </div>
              {col.status === 'New' && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all duration-200 shadow-2xs cursor-pointer"
                  title="Add lead to this stage"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3.5 flex-1">
              {columnLeads.length === 0 ? (
                <div className="h-36 rounded-2xl border-2 border-dashed border-slate-200/80 flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                  <span className="text-xs font-semibold">No opportunities here</span>
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const nextStage = getNextStage(lead.status);
                  const prevStage = getPrevStage(lead.status);

                  return (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="card-hover bg-white p-4 sm:p-4.5 rounded-2xl border border-slate-200/90 shadow-xs cursor-pointer group relative"
                    >
                      {/* Name & Source */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors duration-200 truncate">
                          {lead.name}
                        </h4>
                        <span
                          className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 flex-shrink-0 border border-slate-200/70"
                          title={`Source: ${lead.source}`}
                        >
                          <span className="mr-1">{getSourceIcon(lead.source)}</span>
                          {lead.source}
                        </span>
                      </div>

                      {/* Company */}
                      {lead.company && (
                        <div className="flex items-center text-xs text-slate-700 mb-2 font-semibold">
                          <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}

                      {/* Email */}
                      <div className="flex items-center text-xs text-slate-400 mb-3 truncate font-medium">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>

                      {/* Notes snippet */}
                      {lead.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl line-clamp-2 mb-3 border border-slate-100 italic leading-snug">
                          "{lead.notes}"
                        </p>
                      )}

                      {/* Stage Movement Controls */}
                      <div
                        className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          {prevStage ? (
                            <button
                              onClick={() => onStatusChange(lead, prevStage)}
                              className="px-2 py-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center text-[11px] font-bold cursor-pointer"
                              title={`Move back to ${prevStage}`}
                            >
                              <ArrowLeft className="w-3 h-3 mr-1" />
                              <span>{prevStage}</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-semibold px-2 py-1">Initial</span>
                          )}
                        </div>

                        <div>
                          {nextStage && (
                            <button
                              onClick={() => onStatusChange(lead, nextStage)}
                              className="px-2.5 py-1 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors inline-flex items-center font-bold text-[11px] cursor-pointer shadow-2xs"
                              title={`Advance to ${nextStage}`}
                            >
                              <span>{nextStage}</span>
                              <ArrowRight className="w-3 h-3 ml-1" />
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
