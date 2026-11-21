import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Lead, LeadSource, LeadStatus } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (leadData: Partial<Lead>) => Promise<void>;
  initialData?: Lead | null;
  title: string;
}

const SOURCES: LeadSource[] = [
  'Website',
  'Referral',
  'Cold Outreach',
  'LinkedIn',
  'Advertisement',
  'Event',
  'Other',
];

const STATUSES: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [source, setSource] = useState<LeadSource>('Website');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setCompany(initialData.company || '');
      setSource(initialData.source || 'Website');
      setStatus(initialData.status || 'New');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSource('Website');
      setStatus('New');
      setNotes('');
    }
    setErrors({});
    setServerError(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please provide a valid email format (e.g., user@example.com)';
      }
    }

    if (phone.trim() && phone.trim().length > 30) {
      errs.phone = 'Phone number is too long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        company: company.trim() || undefined,
        source,
        status,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setServerError(
        err.response?.data?.message || err.message || 'Failed to save lead. Please retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg rounded-[28px] sm:rounded-[32px] border shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
          isDark
            ? 'bg-[#0f1424] border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-2xl'
        }`}
      >
        {/* Header */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'
          }`}
        >
          <div>
            <h3 className={`text-base font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter the lead information for your sales pipeline.
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {serverError && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start space-x-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="font-semibold">{serverError}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g. Rajesh Patel"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
                  errors.name
                    ? 'border-rose-500 bg-rose-500/5 focus:ring-4 focus:ring-rose-500/10'
                    : isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-[#161c2e] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                }`}
              />
              {errors.name && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.name}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
                    errors.email
                      ? 'border-rose-500 bg-rose-500/5 focus:ring-4 focus:ring-rose-500/10'
                      : isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-[#161c2e] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                  }`}
                />
                {errors.email && <p className="text-xs text-rose-400 font-semibold mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98234 56789"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-[#161c2e] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                  }`}
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Tata Consultancy Services"
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-[#161c2e] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                }`}
              />
            </div>

            {/* Source & Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Lead Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-bold cursor-pointer ${
                    isDark
                      ? 'bg-[#182035] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {SOURCES.map((s) => (
                    <option key={s} value={s} className={isDark ? 'bg-slate-900 text-white' : ''}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Pipeline Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-bold cursor-pointer ${
                    isDark
                      ? 'bg-[#182035] border-white/10 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st} className={isDark ? 'bg-slate-900 text-white' : ''}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Notes / Requirements
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Client reached out regarding enterprise CRM migration..."
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-2xl border transition-all font-medium ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:bg-[#161c2e] focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15'
                }`}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className={`px-6 py-4 border-t flex items-center justify-end space-x-3 ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50/80 border-slate-100'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className={`px-4 py-2 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-neon px-5 py-2 text-xs font-bold text-white rounded-2xl cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Lead' : 'Save Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
