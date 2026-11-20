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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Delete Lead Confirmation
        </h3>

        <p className="text-sm text-slate-600 mb-4">
          Are you sure you want to permanently remove lead{' '}
          <strong className="text-slate-900">{lead.name}</strong>
          {lead.company ? (
            <>
              {' '}from <strong className="text-slate-900">{lead.company}</strong>
            </>
          ) : null}
          ? This action cannot be undone.
        </p>

        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 mb-6">
          <div className="flex justify-between py-0.5">
            <span>Email:</span>
            <span className="font-medium text-slate-700">{lead.email}</span>
          </div>
          <div className="flex justify-between py-0.5">
            <span>Current Status:</span>
            <span className="font-semibold text-slate-700">{lead.status}</span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm shadow-rose-200 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Lead'}
          </button>
        </div>
      </div>
    </div>
  );
};
