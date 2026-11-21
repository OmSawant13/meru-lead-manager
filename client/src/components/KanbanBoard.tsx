import React from 'react';
import { Lead, LeadStatus } from '../types';
import { getSourceIcon } from './LeadDrawer';
import { useTheme } from '../context/ThemeContext';
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
  dotColor: string;
}> = [
  {
    status: 'New',
    title: 'New Inquiries',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    dotColor: 'bg-blue-500',
  },
  {
    status: 'Contacted',
    title: 'In Outreach',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    status: 'Qualified',
    title: 'Qualified Deals',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
  {
    status: 'Lost',
    title: 'Closed / Lost',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
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
  const { isDark } = useTheme();

  if (isLoading && leads.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-96 rounded-3xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200/60'
            }`}
          />
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
            className={`rounded-3xl border p-4 sm:p-5 flex flex-col min-h-[520px] transition-all duration-300 shadow-xl ${
              isDark
                ? 'bg-[#121727]/85 backdrop-blur-xl border-white/10'
                : 'bg-slate-50/90 backdrop-blur-xl border-slate-200/90'
            }`}
          >
            {/* Column Header */}
            <div
              className={`flex items-center justify-between mb-4 pb-3 border-b ${
                isDark ? 'border-white/10' : 'border-slate-200/70'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <span className={`w-2 h-2 rounded-full ${col.dotColor} shadow-xs animate-pulse`} />
                <span
                  className={`font-black text-sm tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {col.title}
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black border ${
                    col.badgeBg
                  } ${col.badgeText} ${
                    isDark ? 'border-white/10' : 'border-slate-200/60'
                  } shadow-2xs`}
                >
                  {columnLeads.length}
                </span>
              </div>
              {col.status === 'New' && (
                <button
                  onClick={onOpenCreateModal}
                  className={`p-1.5 rounded-xl transition-all duration-200 shadow-2xs cursor-pointer ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/10'
                      : 'text-slate-400 hover:text-indigo-600 hover:bg-white'
                  }`}
                  title="Add lead to this stage"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Column Cards */}
            <div className="space-y-3.5 flex-1">
              {columnLeads.length === 0 ? (
                <div
                  className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center ${
                    isDark
                      ? 'border-white/10 text-slate-500'
                      : 'border-slate-200/80 text-slate-400'
                  }`}
                >
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
                      className={`p-4 sm:p-4.5 rounded-2xl border cursor-pointer group relative transition-all duration-300 hover:-translate-y-1 ${
                        isDark
                          ? 'bg-[#182035]/90 hover:bg-[#1c263e] border-white/10 hover:border-indigo-500/40 shadow-lg'
                          : 'bg-white hover:bg-slate-50/90 border-slate-200/90 hover:border-indigo-400 shadow-xs hover:shadow-md'
                      }`}
                    >
                      {/* Name & Source */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4
                          className={`font-black text-sm transition-colors duration-200 truncate ${
                            isDark
                              ? 'text-white group-hover:text-indigo-400'
                              : 'text-slate-900 group-hover:text-indigo-600'
                          }`}
                        >
                          {lead.name}
                        </h4>
                        <span
                          className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 border ${
                            isDark
                              ? 'bg-white/5 text-slate-300 border-white/10'
                              : 'bg-slate-100 text-slate-600 border-slate-200/70'
                          }`}
                          title={`Source: ${lead.source}`}
                        >
                          <span className="mr-1">{getSourceIcon(lead.source)}</span>
                          {lead.source}
                        </span>
                      </div>

                      {/* Company */}
                      {lead.company && (
                        <div
                          className={`flex items-center text-xs font-medium mb-3 ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}

                      {/* Contact Info Preview */}
                      <div className="flex items-center text-xs text-slate-400 mb-3 truncate font-medium">
                        <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>

                      {/* Stage Advance Arrows */}
                      <div
                        className={`pt-2.5 mt-2 border-t flex items-center justify-between text-xs ${
                          isDark ? 'border-white/10' : 'border-slate-100'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {prevStage ? (
                          <button
                            onClick={() => onStatusChange(lead, prevStage)}
                            title={`Move back to ${prevStage}`}
                            className={`inline-flex items-center text-[11px] font-bold transition-colors ${
                              isDark
                                ? 'text-slate-400 hover:text-white'
                                : 'text-slate-400 hover:text-slate-700'
                            }`}
                          >
                            <ArrowLeft className="w-3 h-3 mr-1" />
                            <span>{prevStage}</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {nextStage ? (
                          <button
                            onClick={() => onStatusChange(lead, nextStage)}
                            title={`Advance to ${nextStage}`}
                            className="inline-flex items-center text-[11px] font-black text-indigo-400 hover:text-indigo-300 transition-colors ml-auto"
                          >
                            <span>{nextStage}</span>
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-400">Archived</span>
                        )}
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
