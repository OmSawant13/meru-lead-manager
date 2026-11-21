import React, { useState, useEffect } from 'react';
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

  // Smooth animation lifecycle state
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cachedLead, setCachedLead] = useState<Lead | null>(lead);

  useEffect(() => {
    if (isOpen && lead) {
      setCachedLead(lead);
      setIsRendered(true);
      // Double rAF ensures the browser paints initial translate-x-full before transitioning to translate-x-0
      const frame1 = requestAnimationFrame(() => {
        const frame2 = requestAnimationFrame(() => {
          setIsVisible(true);
        });
        return () => cancelAnimationFrame(frame2);
      });
      return () => cancelAnimationFrame(frame1);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 450); // match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, lead]);

  if (!isRendered || !cachedLead) return null;

  const currentLead = lead || cachedLead;

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
    <div
      className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-400 ease-out ${
        isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Frosted Dark Backdrop with Smooth Fade */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-400 cursor-pointer"
        onClick={onClose}
      />

      {/* Slide-over Container (Wider: max-w-xl sm:max-w-2xl ~620px to 670px) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-xl sm:max-w-2xl shadow-[-25px_0_60px_rgba(0,0,0,0.5)] border-l flex flex-col justify-between pointer-events-auto transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
            isVisible ? 'translate-x-0' : 'translate-x-full'
          } ${
            isDark
              ? 'bg-[#0f1424] border-white/10 text-white'
              : 'bg-white border-slate-200/90 text-slate-900'
          }`}
        >
          {/* Header */}
          <div
            className={`p-6 sm:px-8 border-b flex items-center justify-between ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
                Lead Dossier
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(currentLead)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                    : 'border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-white'
                }`}
                title="Edit Lead"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(currentLead)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                    : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                }`}
                title="Delete Lead"
              >
                <Trash2 className="w-3.5 h-3.5" />
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
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
            {/* Lead Identity Hero Card */}
            <div className="flex items-start space-x-4 sm:space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-extrabold text-xl shadow-xl shadow-indigo-500/30 ring-2 ring-white/20 flex-shrink-0">
                {getInitials(currentLead.name)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-2xl font-extrabold tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentLead.name}
                </h3>
                {currentLead.company ? (
                  <div className="flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    <Building2 className="w-4 h-4 mr-1.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{currentLead.company}</span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mt-0.5">No company specified</p>
                )}
                <div className="mt-3 flex items-center space-x-2">
                  <StatusBadge status={currentLead.status} />
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                      isDark
                        ? 'bg-white/5 text-slate-300 border-white/10'
                        : 'bg-slate-100 text-slate-700 border-slate-200/60'
                    }`}
                  >
                    <span className="mr-1.5">{getSourceIcon(currentLead.source)}</span>
                    {currentLead.source}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Advancement Stepper */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Pipeline Stage Progression
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {STATUS_LIST.map((st) => {
                  const isActive = currentLead.status === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onStatusChange(currentLead, st)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer text-left flex items-center justify-between ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-md shadow-indigo-500/25 scale-[1.02]'
                          : isDark
                          ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span>{st}</span>
                      {isActive && <Check className="w-3.5 h-3.5 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Contact Details
              </h4>

              {/* Email */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${
                  isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                    <a
                      href={`mailto:${currentLead.email}`}
                      className="text-sm font-semibold text-indigo-500 dark:text-indigo-400 hover:underline truncate block"
                    >
                      {currentLead.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(currentLead.email, 'email')}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
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
              {currentLead.phone && (
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between group transition-all ${
                    isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                      <a
                        href={`tel:${currentLead.phone}`}
                        className={`text-sm font-semibold hover:underline truncate block ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {currentLead.phone}
                      </a>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(currentLead.phone!, 'phone')}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
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

            {/* Opportunity Notes */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Opportunity Notes
              </h4>
              <div
                className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-slate-300'
                    : 'bg-slate-50 border-slate-200/80 text-slate-700'
                }`}
              >
                {currentLead.notes ? (
                  <p className="whitespace-pre-wrap">{currentLead.notes}</p>
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
                <span>Captured: {formatDate(currentLead.createdAt)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Last updated: {formatDate(currentLead.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div
            className={`p-5 sm:px-8 border-t flex justify-end ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`w-full py-3 px-4 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
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
