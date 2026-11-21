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
import { useTheme } from '../context/ThemeContext';

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
      return <Linkedin className="w-3.5 h-3.5 text-blue-500" />;
    case 'Website':
      return <Globe className="w-3.5 h-3.5 text-indigo-500" />;
    case 'Referral':
      return <Share2 className="w-3.5 h-3.5 text-emerald-500" />;
    case 'Cold Outreach':
      return <MessageSquare className="w-3.5 h-3.5 text-amber-500" />;
    case 'Advertisement':
      return <Megaphone className="w-3.5 h-3.5 text-purple-500" />;
    case 'Event':
      return <Calendar className="w-3.5 h-3.5 text-rose-500" />;
    default:
      return <Compass className="w-3.5 h-3.5 text-slate-400" />;
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
  const { isDark } = useTheme();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  if (!isOpen || !lead) return null;

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className={`w-screen max-w-md shadow-2xl border-l flex flex-col justify-between animate-in slide-in-from-right duration-300 ${
            isDark
              ? 'bg-[#0f1424] border-white/10 text-white'
              : 'bg-white border-slate-200/90 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/70 border-slate-100'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Lead Dossier
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(lead)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-white'
                }`}
                title="Edit Lead"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(lead)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                }`}
                title="Delete Lead"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Lead Identity Hero Card */}
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-indigo-500/25 flex-shrink-0">
                {getInitials(lead.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-xl font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {lead.name}
                </h3>
                {lead.company ? (
                  <div className="flex items-center text-sm font-semibold text-slate-400 mt-0.5">
                    <Building2 className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{lead.company}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No company specified</p>
                )}
                <div className="mt-2.5 flex items-center space-x-2">
                  <StatusBadge status={lead.status} />
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${
                      isDark
                        ? 'bg-white/5 text-slate-300 border-white/10'
                        : 'bg-slate-100 text-slate-700 border-slate-200/60'
                    }`}
                  >
                    <span className="mr-1">{getSourceIcon(lead.source)}</span>
                    {lead.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Advancement Stepper */}
            <div
              className={`p-4 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                Pipeline Stage Progression
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_LIST.map((st) => {
                  const isActive = lead.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onStatusChange(lead, st)}
                      className={`py-2 px-3 rounded-xl text-xs font-black border transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/25 scale-[1.02]'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{st}</span>
                      {isActive && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Contact Details
              </h4>

              {/* Email */}
              <div
                className={`p-3.5 rounded-2xl border flex items-center justify-between group ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-xs font-bold text-indigo-400 hover:underline truncate block"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(lead.email, 'email')}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    isDark
                      ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                      : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-white'
                  }`}
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone */}
              {lead.phone && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center justify-between group ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                      <a
                        href={`tel:${lead.phone}`}
                        className={`text-xs font-bold hover:underline truncate block ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {lead.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(lead.phone!, 'phone')}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      isDark
                        ? 'border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        : 'border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-white'
                    }`}
                    title="Copy phone number"
                  >
                    {copiedPhone ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Opportunity Notes
              </h4>
              <div
                className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                {lead.notes ? (
                  <p className="whitespace-pre-wrap">{lead.notes}</p>
                ) : (
                  <p className="italic text-slate-400">No notes recorded for this lead yet.</p>
                )}
              </div>
            </div>

            {/* Audit Timestamps */}
            <div
              className={`pt-4 border-t space-y-2 text-xs text-slate-400 ${
                isDark ? 'border-white/10' : 'border-slate-200/70'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Captured: {formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div
            className={`p-5 border-t flex justify-end ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-2.5 px-4 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
