import React, { useState } from 'react';
import { ShieldAlert, X, Volume2, AlertTriangle, CheckCircle } from 'lucide-react';
import { User } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { storage } from '../services/storage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  reportedUser: User | null;
  onReportSubmitted: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  reportedUser,
  onReportSubmitted
}) => {
  const [reason, setReason] = useState<string>('Uncomfortable or rude language');
  const [customDetails, setCustomDetails] = useState('');
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !reportedUser) return null;

  const reasonsList = [
    'Uncomfortable or rude language in voice message',
    'Asked for private personal contact information',
    'Repeated uninvited calls or spam',
    'Attempted to contact outside the Limitless English platform',
    'Other safety or behavioral concern'
  ];

  const teacherUser = storage.getUsers().find((u) => u.role === 'teacher' && u.isApproved);
  const teacherName = teacherUser ? teacherUser.name : 'Teacher Bahora';

  const handleReadExplanation = () => {
    soundEffects.playClick();
    speechService.speak(
      `Safety report for ${reportedUser.name}. Your safety is our top priority. ${teacherName} will review this message and report immediately. You can choose to block this user so they cannot contact you.`,
      true
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects.playSuccess();

    storage.submitSafetyReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId: reportedUser.id,
      reportedUserName: reportedUser.name,
      reason: `${reason}${customDetails ? ` - Details: ${customDetails}` : ''}`,
      teacherNotes: alsoBlock ? 'User requested immediate block.' : undefined
    });

    if (alsoBlock) {
      storage.unpairStudent(currentUser.id);
    }

    setSubmitted(true);
    speechService.announce(`Safety report submitted to ${teacherName}. Thank you for keeping our community safe.`);
    onReportSubmitted();

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-rose-600 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-100 text-rose-700">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="report-title" className="text-xl font-black text-slate-900">
                Safety Report & Moderation
              </h2>
              <p className="text-sm font-semibold text-rose-700">
                Reporting: {reportedUser.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 focus:ring-4 focus:ring-rose-600"
            aria-label="Close report dialog"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3" role="alert">
            <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto" />
            <h3 className="text-xl font-extrabold text-slate-900">Report Sent to {teacherName}</h3>
            <p className="text-sm text-slate-700 max-w-sm mx-auto">
              We received your report. The teacher will review all voice audio and keep you safe.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={handleReadExplanation}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-bold flex items-center justify-center gap-2 hover:bg-rose-100 focus:ring-4 focus:ring-rose-600"
              aria-label="Listen to safety instructions aloud"
            >
              <Volume2 className="w-5 h-5 text-rose-700" />
              <span>Listen to Safety Explanation</span>
            </button>

            <div>
              <label className="block text-sm font-extrabold text-slate-900 mb-2">
                What happened? (Select reason)
              </label>
              <div className="space-y-2" role="radiogroup" aria-label="Report reason">
                {reasonsList.map((r, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                      reason === r
                        ? 'border-rose-600 bg-rose-50/70 text-slate-900 font-bold'
                        : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="w-5 h-5 text-rose-600 focus:ring-rose-600"
                    />
                    <span className="text-sm">{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="custom-notes" className="block text-sm font-bold text-slate-900 mb-1">
                Additional details for {teacherName} (Optional):
              </label>
              <textarea
                id="custom-notes"
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                placeholder="Describe what occurred or how you felt..."
                rows={2}
                className="w-full p-3 rounded-xl border-2 border-slate-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-400 text-sm"
              />
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 border border-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={alsoBlock}
                onChange={(e) => setAlsoBlock(e.target.checked)}
                className="w-5 h-5 rounded text-rose-600 focus:ring-rose-600"
              />
              <span className="text-sm font-bold text-slate-900">
                Immediately disconnect and block {reportedUser.name} from contacting me
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-100 focus:ring-4 focus:ring-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-rose-700 text-white font-extrabold hover:bg-rose-800 focus:ring-4 focus:ring-rose-600 shadow-md flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Submit Safety Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
