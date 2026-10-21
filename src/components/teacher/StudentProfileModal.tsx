import React, { useState, useEffect } from 'react';
import { 
  X, 
  Award, 
  Coins, 
  BookOpen, 
  Mic, 
  Play, 
  Square, 
  Send, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { User, StudentProgressSummary, PracticeRecording, TestAttempt, TeacherFeedbackItem } from '../../types';
import { teacherService } from '../../services/teacherService';
import { achievementService } from '../../services/achievementService';
import { storage } from '../../services/storage';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { StudentAdjustmentModal } from './StudentAdjustmentModal';

interface StudentProfileModalProps {
  student: User;
  summary?: StudentProgressSummary;
  currentUser: User;
  onClose: () => void;
  onRefresh: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  summary,
  currentUser,
  onClose,
  onRefresh,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recordings' | 'tests' | 'feedback'>('overview');
  const [recordings, setRecordings] = useState<PracticeRecording[]>([]);
  const [testAttempts, setTestAttempts] = useState<TestAttempt[]>([]);
  const [feedbackList, setFeedbackList] = useState<TeacherFeedbackItem[]>([]);
  
  // Feedback form
  const [feedbackText, setFeedbackText] = useState('');
  const [praisePoints, setPraisePoints] = useState('');
  const [improvementTip, setImprovementTip] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Audio player state
  const [playingRecId, setPlayingRecId] = useState<string | null>(null);
  const [playbackAudio, setPlaybackAudio] = useState<HTMLAudioElement | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Adjustment modal
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);

  const loadStudentData = async () => {
    const recs = storage.getPracticeRecordings(student.id);
    setRecordings(recs);

    const ach = await achievementService.getAchievements(student.id);
    setTestAttempts(ach.testAttempts || []);

    const fb = teacherService.getFeedback(student.id);
    setFeedbackList(fb);
  };

  useEffect(() => {
    loadStudentData();
    return () => {
      if (playbackAudio) {
        playbackAudio.pause();
      }
    };
  }, [student.id]);

  const handleTogglePlayAudio = (rec: PracticeRecording) => {
    soundEffects.playClick();
    if (playingRecId === rec.id && playbackAudio) {
      playbackAudio.pause();
      setPlayingRecId(null);
      setPlaybackAudio(null);
      return;
    }

    if (playbackAudio) {
      playbackAudio.pause();
    }

    const audio = new Audio(rec.audioUrl);
    audio.playbackRate = playbackSpeed;
    audio.onended = () => {
      setPlayingRecId(null);
      setPlaybackAudio(null);
    };
    audio.play();
    setPlaybackAudio(audio);
    setPlayingRecId(rec.id);
  };

  const handleSendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSendingFeedback(true);
    try {
      teacherService.sendFeedback({
        studentId: student.id,
        studentName: student.name,
        teacherId: currentUser.id,
        teacherName: currentUser.name,
        targetType: 'general',
        targetId: 'profile-review',
        targetTitle: 'Teacher Learning Check-in',
        feedbackText: feedbackText.trim(),
        praisePoints: praisePoints.trim() || undefined,
        improvementTip: improvementTip.trim() || undefined,
      }, currentUser);

      soundEffects.playSuccess();
      setFeedbackSuccess('Feedback sent! Student will be notified on their dashboard.');
      setFeedbackText('');
      setPraisePoints('');
      setImprovementTip('');
      loadStudentData();
      setTimeout(() => setFeedbackSuccess(null), 5000);
    } catch {
      soundEffects.playWarning();
    } finally {
      setIsSendingFeedback(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-profile-title"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-blue-600 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${student.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center text-2xl font-black shadow-md`}>
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="student-profile-title" className="text-2xl font-black text-slate-900">
                  {student.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-900 capitalize">
                  {student.ageGroup} Learner
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {student.email} • Vision: {student.visionPreference} • Joined: {student.createdAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdjustmentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              title="Audit Correction for Coins"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Adjust Coins</span>
            </button>

            <button
              onClick={() => {
                if (playbackAudio) playbackAudio.pause();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Lessons Completed</span>
            <p className="text-xl font-black text-slate-900">
              {summary?.completedLessonsCount || 0}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Topics Mastered</span>
            <p className="text-xl font-black text-emerald-800">
              {summary?.completedTopicIds.length || 0} / 20
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase">English Coins</span>
            <p className="text-xl font-black text-amber-600 flex items-center gap-1">
              <Coins className="w-5 h-5" />
              <span>{summary?.coinsBalance || 0}</span>
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Badges Earned</span>
            <p className="text-xl font-black text-purple-700 flex items-center gap-1">
              <Award className="w-5 h-5" />
              <span>{summary?.earnedBadgesCount || 0}</span>
            </p>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Overview & Progress
          </button>
          <button
            onClick={() => setActiveTab('recordings')}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'recordings'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speaking Recordings ({recordings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tests'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Test Results ({testAttempts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'feedback'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Teacher Feedback ({feedbackList.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-900">Total Curriculum Progress</span>
                <span className="text-sm font-black text-blue-900">{summary?.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-blue-200 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-blue-700 h-full rounded-full transition-all duration-500"
                  style={{ width: `${summary?.progressPercentage || 0}%` }}
                />
              </div>
              <p className="text-xs text-blue-800 font-medium">
                {summary?.completedLessonsCount || 0} of {summary?.totalLessonsCount || 115} lessons verified and completed.
              </p>
            </div>

            {student.bioText && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Student Learning Bio</span>
                <p className="text-sm text-slate-800 italic">"{student.bioText}"</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Speaking Recordings */}
        {activeTab === 'recordings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                Authorized Voice Recordings & AI Evaluations
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Playback Speed:</span>
                <button
                  onClick={() => setPlaybackSpeed(0.8)}
                  className={`px-2 py-1 rounded-md text-xs font-bold ${
                    playbackSpeed === 0.8 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  0.8x Slow
                </button>
                <button
                  onClick={() => setPlaybackSpeed(1.0)}
                  className={`px-2 py-1 rounded-md text-xs font-bold ${
                    playbackSpeed === 1.0 ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  1.0x Normal
                </button>
              </div>
            </div>

            {recordings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                No recorded speaking submissions found for {student.name} yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recordings.map((rec) => {
                  const isPlaying = playingRecId === rec.id;
                  return (
                    <div key={rec.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-xs font-bold text-blue-700 uppercase">{rec.topicTitle}</span>
                          <h4 className="text-sm font-black text-slate-900">"{rec.questionText}"</h4>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>Submitted: {new Date(rec.submittedAt).toLocaleDateString()} ({rec.durationSeconds}s)</span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleTogglePlayAudio(rec)}
                          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs cursor-pointer ${
                            isPlaying
                              ? 'bg-rose-600 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {isPlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                          <span>{isPlaying ? 'Stop' : 'Play Audio'}</span>
                        </button>
                      </div>

                      {rec.evaluation && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2 text-xs">
                          <div className="flex items-center gap-4">
                            <span className="font-bold text-slate-700">
                              Clarity: <strong className="text-blue-800">{rec.evaluation.clarityScore}/5</strong>
                            </span>
                            <span className="font-bold text-slate-700">
                              Grammar: <strong className="text-purple-800">{rec.evaluation.grammarScore}/5</strong>
                            </span>
                            <span className="font-bold text-slate-700">
                              Relevance: <strong className="text-teal-800">{rec.evaluation.relevanceScore}/5</strong>
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-500 block">Transcript:</span>
                            <p className="text-slate-900 italic">"{rec.evaluation.transcript || 'No recognizable speech'}"</p>
                          </div>
                          {rec.evaluation.positiveFeedback && (
                            <p className="text-emerald-800 font-semibold">
                              ✓ {rec.evaluation.positiveFeedback}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Test Results */}
        {activeTab === 'tests' && (
          <div className="space-y-4">
            <h3 className="text-base font-black text-slate-900">
              End-of-Topic Mastery Test Attempts
            </h3>

            {testAttempts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500 text-xs">
                No test attempts recorded yet.
              </div>
            ) : (
              <div className="space-y-3">
                {testAttempts.map((attempt) => (
                  <div key={attempt.id} className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{attempt.topicTitle} Mastery Test</h4>
                      <p className="text-xs text-slate-500">
                        Date: {new Date(attempt.completedAt).toLocaleDateString()} • Speaking: {attempt.speakingCompleted ? 'Attempted' : 'Not recorded'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        attempt.passed
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-rose-100 text-rose-950 border border-rose-300'
                      }`}>
                        {attempt.scorePercentage}% • {attempt.passed ? 'PASSED' : 'RETRY NEEDED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Teacher Feedback */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <form onSubmit={handleSendFeedback} className="p-5 rounded-2xl bg-purple-50/70 border-2 border-purple-200 space-y-3">
              <h3 className="text-sm font-black text-purple-950 flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-700" />
                <span>Send Educational Feedback to {student.name}</span>
              </h3>

              {feedbackSuccess && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{feedbackSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-black text-purple-900 uppercase">Main Feedback Note</label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={`Write warm, encouraging advice for ${student.name}...`}
                  className="w-full p-3 rounded-xl border-2 border-purple-200 bg-white text-xs font-medium focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-900 uppercase">Praise Point</label>
                  <input
                    type="text"
                    value={praisePoints}
                    onChange={(e) => setPraisePoints(e.target.value)}
                    placeholder="e.g. Great confidence with greeting words!"
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-purple-900 uppercase">Practice Tip</label>
                  <input
                    type="text"
                    value={improvementTip}
                    onChange={(e) => setImprovementTip(e.target.value)}
                    placeholder="e.g. Remember to pronounce the final 's' in fruits."
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSendingFeedback || !feedbackText.trim()}
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-xs shadow-md"
                >
                  {isSendingFeedback ? 'Sending...' : 'Send to Student Dashboard'}
                </button>
              </div>
            </form>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Previous Feedback History</h4>
              {feedbackList.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No feedback sent yet.</p>
              ) : (
                <div className="space-y-2">
                  {feedbackList.map((fb) => (
                    <div key={fb.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="font-bold text-purple-900">{fb.teacherName} • {fb.targetTitle}</span>
                        <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-800 font-medium">"{fb.feedbackText}"</p>
                      {fb.praisePoints && <p className="text-emerald-800">★ Praise: {fb.praisePoints}</p>}
                      {fb.improvementTip && <p className="text-amber-800">💡 Tip: {fb.improvementTip}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adjustment Modal nested */}
        {isAdjustmentModalOpen && (
          <StudentAdjustmentModal
            student={student}
            currentBalance={summary?.coinsBalance || 0}
            currentUser={currentUser}
            onClose={() => setIsAdjustmentModalOpen(false)}
            onSuccess={() => {
              loadStudentData();
              onRefresh();
            }}
          />
        )}
      </div>
    </div>
  );
};
