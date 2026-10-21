import React, { useState } from 'react';
import { 
  Clock, 
  RefreshCw, 
  LogOut, 
  BookOpen, 
  ShieldCheck, 
  Volume2, 
  CheckCircle,
  HelpCircle,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { User } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface PendingApprovalViewProps {
  currentUser: User;
  onRefresh: () => Promise<void>;
  onSignOut: () => void;
  onBrowseTopics: () => void;
  onOpenAvatar?: () => void;
}

export const PendingApprovalView: React.FC<PendingApprovalViewProps> = ({
  currentUser,
  onRefresh,
  onSignOut,
  onBrowseTopics,
  onOpenAvatar
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);

  const handleReadStatus = () => {
    soundEffects.playClick();
    speechService.speak(
      `Hello ${currentUser.name}. Your adult learner account is currently pending teacher approval. A teacher must review your account before voice messaging and partner audio calls are unlocked. You can practice with the five conversation topics in solo mode while you wait.`,
      true
    );
  };

  const handleCheckStatus = async () => {
    soundEffects.playClick();
    setIsRefreshing(true);
    setStatusFeedback(null);
    try {
      await onRefresh();
      // If still pending
      setStatusFeedback('Checked! Your account is still pending teacher approval. Please check again shortly.');
      speechService.announce('Checked. Your account is still awaiting teacher approval.');
    } catch {
      setStatusFeedback('Unable to check status right now. Please check your internet connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in" role="region" aria-label="Account Pending Approval Status">
      {/* Top Banner */}
      <section className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-xl border-4 border-blue-400">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/80 text-blue-200 text-xs font-bold border border-blue-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Limitless English Connect • Student Onboarding</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              Welcome, {currentUser.name}!
            </h1>
            <p className="text-sm md:text-base text-blue-100 font-medium max-w-xl">
              Your adult learner account has been securely created in the cloud database.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleReadStatus}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs md:text-sm flex items-center gap-2 shadow-md focus:ring-4 focus:ring-amber-200 transition-transform active:scale-95"
              aria-label="Listen to approval status explanation aloud"
            >
              <Volume2 className="w-4 h-4 text-amber-950" />
              <span>Listen Aloud</span>
            </button>

            <button
              onClick={onSignOut}
              className="px-4 py-2.5 rounded-xl bg-blue-950/80 hover:bg-rose-900/80 text-white border border-blue-400 font-bold text-xs md:text-sm flex items-center gap-2 shadow-md focus:ring-4 focus:ring-rose-400 transition-colors"
              aria-label="Sign out of Limitless English"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pending Approval Card */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-lg space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border-2 border-amber-300 shadow-sm">
            <Clock className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-md bg-amber-100 text-amber-900 font-black text-xs uppercase tracking-wider">
              Status: Awaiting Teacher Approval
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              Teacher Review in Progress
            </h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-2xl">
              To protect the community and pair students with compatible speaking buddies, an instructor must approve new accounts before voice messaging and live peer phone calls are activated.
            </p>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 text-sm">
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Learner Name</span>
            <span className="block font-black text-slate-900 mt-0.5">{currentUser.name}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Email Address</span>
            <span className="block font-semibold text-slate-800 mt-0.5 truncate">{currentUser.email}</span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Cohort Category</span>
            <span className="block font-black text-blue-700 mt-0.5">
              Adult (18+)
            </span>
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase">Native Language</span>
            <span className="block font-semibold text-slate-800 mt-0.5">{currentUser.nativeLanguage || 'Beginner'}</span>
          </div>
        </div>

        {/* Feedback message */}
        {statusFeedback && (
          <div 
            className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-900 text-sm font-bold flex items-center gap-2"
            role="status"
            aria-live="polite"
          >
            <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
            <span>{statusFeedback}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <button
            onClick={handleCheckStatus}
            disabled={isRefreshing}
            className="py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md focus:ring-4 focus:ring-blue-400 disabled:opacity-50 transition-all active:scale-95"
            aria-label="Check if your account has been approved by the teacher"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Checking Supabase...' : 'Check Approval Status'}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              onBrowseTopics();
            }}
            className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 border-2 border-slate-300 font-black text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-slate-400 transition-colors"
            aria-label="Browse the five conversation topics in solo practice mode"
          >
            <BookOpen className="w-4 h-4 text-blue-700" />
            <span>Practice Topics (Solo Mode)</span>
          </button>

          {onOpenAvatar && (
            <button
              onClick={() => {
                soundEffects.playClick();
                onOpenAvatar();
              }}
              className="py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-amber-200 transition-all active:scale-95"
              aria-label="Open My Avatar and create your character while waiting"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>My Avatar & English Coins</span>
            </button>
          )}
        </div>
      </section>

      {/* Helpful Safeguarding & Teacher Information */}
      <section className="bg-slate-100 rounded-3xl p-6 border-2 border-slate-200 text-sm text-slate-700 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-black">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Why does Limitless English require teacher review?</span>
        </div>
        <p className="leading-relaxed">
          Limitless English Connect provides audio-only conversations for learners who are blind or have low vision. To prevent spam, harassment, and unauthorized access, all learner registrations must be verified by a teacher before students can contact one another.
        </p>
        <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
          <strong>Teacher Tip:</strong> If you are the teacher configuring this platform, promote your account to teacher in your Supabase SQL Editor, then log in to view the pending approval queue in the Teacher Dashboard.
        </div>
      </section>
    </div>
  );
};
