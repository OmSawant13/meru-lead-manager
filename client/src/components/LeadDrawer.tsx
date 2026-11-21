import React, { useState } from 'react';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  Copy,
  Check,
  Globe,
  Share2,
  MessageSquare,
  Linkedin,
  Megaphone,
  Compass,
} from 'lucide-react';
import { Lead, LeadStatus, LeadSource } from '../types';
import { StatusBadge } from './LeadTable';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
  onStatusChange: (lead: Lead, status: LeadStatus) => void;
}

export const getSourceIcon = (source: LeadSource) => {
  switch (source) {
    case 'LinkedIn':
      return <Linkedin className="w-3.5 h-3.5 text-blue-600" />;
    case 'Website':
      return <Globe className="w-3.5 h-3.5 text-indigo-600" />;
    case 'Referral':
      return <Share2 className="w-3.5 h-3.5 text-emerald-600" />;
    case 'Cold Outreach':
      return <MessageSquare className="w-3.5 h-3.5 text-amber-600" />;
    case 'Advertisement':
      return <Megaphone className="w-3.5 h-3.5 text-purple-600" />;
    case 'Event':
      return <Calendar className="w-3.5 h-3.5 text-rose-600" />;
    default:
      return <Compass className="w-3.5 h-3.5 text-slate-500" />;
  }
};

export const LeadDrawer: React.FC<LeadDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !lead) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(lead.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const STATUS_LIST: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-slate-200/80 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Lead Dossier
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(lead)}
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-xs font-semibold flex items-center space-x-1"
                title="Edit Lead"
              >
                <Edit2 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={() => onDelete(lead)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-xs font-semibold flex items-center space-x-1"
                title="Delete Lead"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Lead Identity Hero Card */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100 flex-shrink-0">
                {getInitials(lead.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                  {lead.name}
                </h3>
                {lead.company ? (
                  <div className="flex items-center text-sm font-medium text-slate-600 mt-0.5">
                    <Building2 className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No company specified</p>
                )}
                <div className="mt-2.5 flex items-center space-x-2">
                  <StatusBadge status={lead.status} />
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                    <span className="mr-1">{getSourceIcon(lead.source)}</span>
                    {lead.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Pipeline Status Switcher */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Pipeline Stage
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {STATUS_LIST.map((st) => {
                  const isActive = lead.status === st;
                  return (
                    <button
                      key={st}
                      onClick={() => onStatusChange(lead, st)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all text-center ${
                        isActive
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Actions Grid */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Contact Information
              </span>

              {/* Email Row */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between group hover:border-indigo-300 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-sm font-semibold text-slate-800 hover:text-indigo-600 truncate block"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Phone Row */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between group hover:border-indigo-300 transition-colors">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Phone Number
                    </span>
                    {lead.phone ? (
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-sm font-semibold text-slate-800 hover:text-indigo-600 truncate block"
                      >
                        {lead.phone}
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not provided</span>
                    )}
                  </div>
                </div>
                {lead.phone && (
                  <button
                    onClick={handleCopyPhone}
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 transition-colors"
                    title="Copy phone"
                  >
                    {copiedPhone ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Notes & Context
              </span>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {lead.notes && lead.notes.trim() !== '' ? (
                  lead.notes
                ) : (
                  <span className="text-slate-400 italic text-xs">
                    No notes recorded for this lead. Click Edit to add context, deal sizes, or meeting logs.
                  </span>
                )}
              </div>
            </div>

            {/* Timestamps & Audit Log */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-400">
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Created:
                </span>
                <span className="font-medium text-slate-600">{formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  Last Updated:
                </span>
                <span className="font-medium text-slate-600">{formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">ID: {lead.id.slice(-8)}</span>
            <button
              onClick={() => onEdit(lead)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
            >
              Modify Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
