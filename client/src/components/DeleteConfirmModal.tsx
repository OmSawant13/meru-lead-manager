import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Lead } from '../types';
import { useTheme } from '../context/ThemeContext';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirm,
  isDeleting,
}) => {
  const { isDark } = useTheme();
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-[28px] sm:rounded-[32px] border shadow-2xl overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
          isDark
            ? 'bg-[#0f1424] border-white/10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.7)]'
            : 'bg-white border-slate-200/90 text-slate-900 shadow-2xl'
        }`}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
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

          <div className="mt-4">
            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Delete Lead Opportunity?
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Are you sure you want to permanently remove <strong className={isDark ? 'text-white' : 'text-slate-800'}>{lead.name}</strong> from your pipeline?
              {lead.company && <span> Associated with <strong>{lead.company}</strong>.</span>}
              This action cannot be undone.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className={`px-4 py-2 text-xs font-bold rounded-2xl border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Keep Lead
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 active:scale-98 rounded-2xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
