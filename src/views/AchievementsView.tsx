import React, { useState, useEffect } from 'react';
import { 
  Award, 
  ArrowLeft, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Coins, 
  BookOpen, 
  RotateCcw, 
  Trophy,
  Star,
  Shield,
  HelpCircle
} from 'lucide-react';
import { User } from '../types';
import { StudentAchievementsProfile, Badge } from '../types/achievements';
import { achievementService, ALL_BADGES } from '../services/achievementService';
import { avatarService } from '../services/avatarService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { BadgeGraphic } from '../components/BadgeGraphic';

interface AchievementsViewProps {
  currentUser: User;
  onBack: () => void;
  onNavigateToTopic?: (topicId: string) => void;
  onOpenTestForTopic?: (topicId: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  currentUser,
  onBack,
  onNavigateToTopic,
  onOpenTestForTopic,
}) => {
  const [profile, setProfile] = useState<StudentAchievementsProfile | null>(null);
  const [coinsBalance, setCoinsBalance] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'all' | 'earned' | 'locked' | 'history'>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    loadData();
  }, [currentUser.id]);

  const loadData = async () => {
    const ach = await achievementService.getAchievements(currentUser.id);
    setProfile(ach);
    const av = await avatarService.getProfile(currentUser.id);
    setCoinsBalance(av.coinsBalance || 0);
  };

  const handleReadSummary = () => {
    soundEffects.playClick();
    if (!profile) return;
    const earnedCount = profile.earnedBadges.length;
    const totalBadges = ALL_BADGES.length;
    const passedCount = profile.completedTopicIds.length;
    const summary = `Achievements Overview for ${currentUser.name}. You have earned ${earnedCount} out of ${totalBadges} achievement badges. You have passed ${passedCount} out of 20 English topic tests. Your current balance is ${coinsBalance} virtual English Coins. Keep going to unlock all 20 topic badges!`;
    speechService.speak(summary, true);
  };

  const earnedBadgeIds = profile?.earnedBadges.map((b) => b.badgeId) || [];
  const earnedBadges = ALL_BADGES.filter((b) => earnedBadgeIds.includes(b.id));
  const lockedBadges = ALL_BADGES.filter((b) => !earnedBadgeIds.includes(b.id));

  const badgesToDisplay = 
    activeTab === 'earned' ? earnedBadges :
    activeTab === 'locked' ? lockedBadges :
    ALL_BADGES;

  const completionPercent = Math.round(((profile?.completedTopicIds.length || 0) / 20) * 100);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Navigation & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.playClick();
              onBack();
            }}
            className="p-3 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-100 text-slate-800 flex items-center gap-2 font-bold text-sm shadow-xs focus:ring-4 focus:ring-blue-300"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Student Accolades & Milestones</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              My Achievements
            </h1>
          </div>
        </div>

        <button
          onClick={handleReadSummary}
          className="px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm flex items-center gap-2 shadow-md focus:ring-4 focus:ring-blue-300 active:scale-95 transition-all"
          aria-label="Listen to achievements summary aloud"
        >
          <Volume2 className="w-5 h-5 text-amber-300" />
          <span>Read Achievements Aloud</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Badges Earned */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Badges Earned
            </span>
            <div className="text-2xl font-black text-slate-900">
              {earnedBadges.length} <span className="text-sm font-bold text-slate-400">/ {ALL_BADGES.length}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Tests Passed */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tests Passed
            </span>
            <div className="text-2xl font-black text-slate-900">
              {profile?.completedTopicIds.length || 0} <span className="text-sm font-bold text-slate-400">/ 20</span>
            </div>
          </div>
        </div>

        {/* Card 3: English Coins Balance */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center shrink-0">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Coin Balance
            </span>
            <div className="text-2xl font-black text-slate-900">
              {coinsBalance} <span className="text-sm font-bold text-slate-500">Coins</span>
            </div>
          </div>
        </div>

        {/* Card 4: Curriculum Progress */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Curriculum Mastery
            </span>
            <div className="text-2xl font-black text-slate-900">
              {completionPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-2">
        <div className="flex items-center justify-between text-xs font-black text-slate-700">
          <span>Curriculum Mastery Progress (Pass 20 Topic Tests)</span>
          <span>{profile?.completedTopicIds.length || 0} of 20 Topics Completed</span>
        </div>
        <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden">
          <div
            className="bg-linear-to-r from-blue-600 via-indigo-600 to-amber-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, completionPercent)}%` }}
            role="progressbar"
            aria-valuenow={completionPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex flex-wrap gap-2 p-2 bg-slate-200/80 rounded-2xl border border-slate-300" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'all'}
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('all');
            speechService.announce(`Showing all ${ALL_BADGES.length} badges.`);
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
            activeTab === 'all'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
          }`}
        >
          All Badges ({ALL_BADGES.length})
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'earned'}
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('earned');
            speechService.announce(`Showing ${earnedBadges.length} earned badges.`);
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
            activeTab === 'earned'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
          }`}
        >
          Earned ({earnedBadges.length})
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'locked'}
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('locked');
            speechService.announce(`Showing ${lockedBadges.length} locked badges.`);
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
            activeTab === 'locked'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
          }`}
        >
          Locked ({lockedBadges.length})
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'history'}
          onClick={() => {
            soundEffects.playClick();
            setActiveTab('history');
            speechService.announce(`Showing test attempts history.`);
          }}
          className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-bold text-sm transition-all border-2 ${
            activeTab === 'history'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-100'
          }`}
        >
          Test History ({profile?.testAttempts.length || 0})
        </button>
      </nav>

      {/* BADGES DISPLAY (Tabs 1-3) */}
      {activeTab !== 'history' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {badgesToDisplay.map((badge) => {
              const isUnlocked = earnedBadgeIds.includes(badge.id);
              const earnedInfo = profile?.earnedBadges.find((b) => b.badgeId === badge.id);
              return (
                <div
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge)}
                  className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col items-center justify-between"
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for badge ${badge.name}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedBadge(badge);
                    }
                  }}
                >
                  <BadgeGraphic
                    badge={badge}
                    isUnlocked={isUnlocked}
                    earnedAt={earnedInfo?.earnedAt}
                    size="md"
                    showAudioButton={true}
                  />

                  <div className="mt-3 w-full pt-3 border-t border-slate-100 text-center">
                    {badge.topicId && onOpenTestForTopic && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenTestForTopic(badge.topicId!);
                        }}
                        className={`w-full py-1.5 px-2 rounded-xl text-xs font-black transition-colors ${
                          isUnlocked
                            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            : 'bg-blue-700 text-white hover:bg-blue-800'
                        }`}
                      >
                        {isUnlocked ? 'Retake Test' : 'Take Test'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TEST ATTEMPTS HISTORY (Tab 4) */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {profile?.testAttempts && profile.testAttempts.length > 0 ? (
            <div className="space-y-3">
              {profile.testAttempts.map((attempt) => (
                <div
                  key={attempt.id}
                  className="bg-white rounded-2xl p-5 border-2 border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                        attempt.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {attempt.passed ? '✓ Passed (>=60%)' : 'Needs Review (<60%)'}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(attempt.completedAt).toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {attempt.topicTitle} Test Attempt
                    </h3>
                    <p className="text-xs text-slate-600">
                      Objective Score: {attempt.objectiveScore} / {attempt.totalObjective} ({attempt.scorePercentage}%) • Speaking: {attempt.speakingCompleted ? '✓ Completed' : 'Incomplete'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {attempt.coinsAwarded > 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 font-black text-xs border border-amber-300">
                        <Coins className="w-4 h-4 text-amber-600" />
                        <span>+{attempt.coinsAwarded} Coins</span>
                      </span>
                    )}

                    {onOpenTestForTopic && (
                      <button
                        onClick={() => onOpenTestForTopic(attempt.topicId)}
                        className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retake</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-3xl border-2 border-slate-200 space-y-3">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-black text-slate-700">No Test Attempts Yet</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Complete any topic lessons and pass the 5-question mastery test to earn your first achievement badge and 30 English Coins!
              </p>
            </div>
          )}
        </div>
      )}

      {/* SELECTED BADGE DETAIL MODAL */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="badge-detail-title"
        >
          <div className="bg-white rounded-3xl max-w-md w-full border-4 border-slate-300 shadow-2xl p-6 space-y-6 text-center animate-in zoom-in-95">
            <div className="flex justify-center py-2">
              <BadgeGraphic
                badge={selectedBadge}
                isUnlocked={earnedBadgeIds.includes(selectedBadge.id)}
                size="lg"
                showAudioButton={false}
              />
            </div>

            <div className="space-y-2">
              <h3 id="badge-detail-title" className="text-2xl font-black text-slate-900">
                {selectedBadge.name}
              </h3>
              <p className="text-sm text-slate-600">{selectedBadge.description}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <span className="font-black text-slate-900 block">Unlock Criteria:</span>
              <p className="text-slate-700">{selectedBadge.unlockCriteria}</p>
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 font-bold text-amber-900">
                <span>Reward Value:</span>
                <span>+{selectedBadge.coinReward} English Coins</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  const isUnl = earnedBadgeIds.includes(selectedBadge.id);
                  const msg = `${selectedBadge.name}. ${isUnl ? 'You have unlocked this badge!' : 'Locked.'} ${selectedBadge.description}. Criteria: ${selectedBadge.unlockCriteria}. Reward: ${selectedBadge.coinReward} coins.`;
                  speechService.speak(msg, true);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4 text-blue-700" />
                <span>Hear Details</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBadge(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
