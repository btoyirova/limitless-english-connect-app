import React, { useState } from 'react';
import { X, ShieldAlert, Award, Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '../../types';
import { teacherService } from '../../services/teacherService';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';

interface StudentAdjustmentModalProps {
  student: User;
  currentBalance: number;
  currentUser: User;
  onClose: () => void;
  onSuccess: () => void;
}

export const StudentAdjustmentModal: React.FC<StudentAdjustmentModalProps> = ({
  student,
  currentBalance,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'deduct'>('add');
  const [amount, setAmount] = useState<number>(20);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!reason || reason.trim().length < 5) {
      setError('Please provide a legitimate justification (minimum 5 characters). This is recorded in the permanent audit trail.');
      return;
    }

    if (amount <= 0 || amount > 100) {
      setError('Adjustment amount must be between 1 and 100 coins.');
      return;
    }

    const netAdjustment = adjustmentType === 'add' ? amount : -amount;

    setIsSubmitting(true);
    try {
      const res = await teacherService.adjustStudentAccount(
        student.id,
        netAdjustment,
        undefined,
        reason,
        currentUser
      );

      soundEffects.playSuccess();
      speechService.announce(`Successfully adjusted ${student.name}'s balance. New balance: ${res.newBalance} coins.`);
      onSuccess();
      onClose();
    } catch (err: any) {
      soundEffects.playWarning();
      setError(err?.message || 'Failed to apply adjustment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="adj-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full border-4 border-amber-400 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Auditable Administrative Correction</span>
            </div>
            <h2 id="adj-modal-title" className="text-xl md:text-2xl font-black text-slate-900">
              Adjust {student.name}'s Coins
            </h2>
            <p className="text-xs text-slate-500">
              Current Balance: <strong className="text-amber-700">{currentBalance} English Coins</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 text-xs flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-slate-700 block">
              Action
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustmentType('add')}
                className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  adjustmentType === 'add'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>Credit (+ Add Coins)</span>
              </button>

              <button
                type="button"
                onClick={() => setAdjustmentType('deduct')}
                className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  adjustmentType === 'deduct'
                    ? 'border-rose-600 bg-rose-50 text-rose-950 shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Coins className="w-4 h-4 text-rose-600" />
                <span>Debit (- Deduct Coins)</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adj-amount" className="text-xs font-black uppercase text-slate-700 block">
              Coins Amount (1 - 100)
            </label>
            <input
              id="adj-amount"
              type="number"
              min="1"
              max="100"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-300 focus:border-amber-500 font-bold text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="adj-reason" className="text-xs font-black uppercase text-slate-700 block">
              Justification & Audit Reason (Required)
            </label>
            <textarea
              id="adj-reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Compensated 20 coins due to microphone recording glitch on Lesson 2 quiz."
              className="w-full p-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 text-xs font-medium"
              required
            />
            <span className="text-[11px] text-slate-500 block">
              This reason is permanently logged with your name ({currentUser.name}) and timestamp.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black text-xs shadow-md"
            >
              {isSubmitting ? 'Recording Audit...' : 'Confirm & Log Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
