import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Lead } from '../types';

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
  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2">
          Delete Opportunity
        </h3>

        <p className="text-xs sm:text-sm text-slate-500 mb-4 leading-relaxed font-medium">
          Are you sure you want to permanently delete lead{' '}
          <strong className="text-slate-900">{lead.name}</strong>
          {lead.company ? (
            <>
              {' '}from <strong className="text-slate-900">{lead.company}</strong>
            </>
          ) : null}
          ? This record will be permanently purged from your database.
        </p>

        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs text-slate-500 mb-6 space-y-1">
          <div className="flex justify-between py-0.5">
            <span className="font-semibold text-slate-400">Email:</span>
            <span className="font-bold text-slate-800">{lead.email}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="font-semibold text-slate-400">Stage:</span>
            <span className="font-bold text-slate-800">{lead.status}</span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 disabled:opacity-50 rounded-2xl shadow-md shadow-rose-500/20 transition-all duration-200 cursor-pointer"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
