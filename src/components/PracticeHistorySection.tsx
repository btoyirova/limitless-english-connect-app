import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  HelpCircle, 
  RefreshCw,
  Clock,
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PracticeRecording } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface PracticeHistoryProps {
  recordings: PracticeRecording[];
  onDeleteRecording: (id: string, storagePath?: string) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const PracticeHistorySection: React.FC<PracticeHistoryProps> = ({
  recordings,
  onDeleteRecording,
  onRefresh,
  isLoading = false,
}) => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [expandedId, setExpandedId] = useState<string | null>(recordings[0]?.id || null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlay = (rec: PracticeRecording) => {
    if (playingId === rec.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setPlayingId(null);
      setPlaybackProgress(0);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    soundEffects.playClick();
    speechService.announce(`Playing practice recording for ${rec.topicTitle}`);

    const audio = new Audio(rec.audioUrl);
    audioRef.current = audio;
    setPlayingId(rec.id);
    setPlaybackProgress(0);

    audio.ontimeupdate = () => {
      if (audio.duration && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        setPlaybackProgress(pct);
      }
    };

    audio.onended = () => {
      setPlayingId(null);
      setPlaybackProgress(0);
    };

    audio.onerror = () => {
      setPlayingId(null);
      soundEffects.playWarning();
      speechService.announce('Could not play this recording.');
    };

    audio.play().catch(() => {
      setPlayingId(null);
    });
  };

  const handleListenEvaluationAloud = (rec: PracticeRecording) => {
    if (!rec.evaluation) return;
    soundEffects.playClick();
    const evalData = rec.evaluation;

    if (!evalData.isReliable) {
      speechService.speak(
        `AI Evaluation Notice: ${evalData.unclearReason || 'The audio could not be evaluated reliably. Please record your answer again.'}`,
        true
      );
      return;
    }

    const textToSpeak = `AI Speaking Evaluation for ${rec.topicTitle}. ` +
      `Your answer: ${evalData.transcript}. ` +
      `Pronunciation clarity score: ${evalData.clarityScore} out of 5. ` +
      `Grammar score: ${evalData.grammarScore} out of 5. ` +
      `Relevance score: ${evalData.relevanceScore} out of 5. ` +
      `What you did well: ${evalData.positiveFeedback}. ` +
      `Gentle tip: ${evalData.gentleCorrection}. ` +
      `Next practice: ${evalData.nextPracticeTip}`;

    speechService.speak(textToSpeak, true);
  };

  const handleDelete = async (rec: PracticeRecording) => {
    soundEffects.playClick();
    const confirmed = window.confirm(`Delete this practice recording for "${rec.topicTitle}"?`);
    if (!confirmed) return;

    if (playingId === rec.id && audioRef.current) {
      audioRef.current.pause();
      setPlayingId(null);
    }

    setIsDeletingId(rec.id);
    try {
      await onDeleteRecording(rec.id, rec.storagePath);
      soundEffects.playSuccess();
      speechService.announce('Recording deleted from practice history.');
    } catch {
      soundEffects.playWarning();
      speechService.announce('Failed to delete recording.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <section 
      className="bg-white rounded-3xl p-6 md:p-8 border-4 border-slate-300 shadow-xl space-y-6"
      aria-labelledby="practice-history-heading"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-600" aria-hidden="true" />
            <span className="text-xs font-black uppercase tracking-wider text-blue-700">
              Personal Speaking Portfolio
            </span>
          </div>
          <h2 id="practice-history-heading" className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
            My Speaking Practice ({recordings.length})
          </h2>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Listen to your saved voice answers, review real AI speaking evaluations, and track your progress.
          </p>
        </div>

        {onRefresh && (
          <button
            onClick={() => {
              soundEffects.playClick();
              onRefresh();
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-white text-slate-800 font-bold text-xs focus:ring-4 focus:ring-blue-400 disabled:opacity-60"
            aria-label="Refresh practice recordings list"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {recordings.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 space-y-3">
          <Award className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">
            No Saved Practice Recordings Yet
          </h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Choose any topic question above, record your voice, and click <strong>"Save and Evaluate"</strong> to save your answer and receive real AI speaking feedback here!
          </p>
        </div>
      ) : (
        <div className="space-y-4" role="list" aria-label="Saved practice recordings list">
          {recordings.map((rec) => {
            const isPlaying = playingId === rec.id;
            const isExpanded = expandedId === rec.id;
            const hasEval = !!rec.evaluation;
            const evalData = rec.evaluation;

            return (
              <article
                key={rec.id}
                role="listitem"
                className="rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-400 transition-all shadow-xs overflow-hidden"
              >
                {/* Header row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50/70 border-b border-slate-100">
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-200">
                        {rec.topicTitle}
                      </span>
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(rec.submittedAt)}
                      </span>
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {rec.durationSeconds}s duration
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 pt-1">
                      "{rec.questionText}"
                    </h4>
                  </div>

                  {/* Play, Toggle, Delete Controls */}
                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleTogglePlay(rec)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-xs text-white shadow-sm transition-transform active:scale-95 focus:ring-4 focus:ring-blue-400 ${
                        isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-700 hover:bg-blue-800'
                      }`}
                      aria-label={isPlaying ? `Pause recording for ${rec.topicTitle}` : `Play your recorded answer for ${rec.topicTitle}`}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      <span>{isPlaying ? 'Pause' : 'Play My Voice'}</span>
                    </button>

                    {hasEval && (
                      <button
                        onClick={() => handleListenEvaluationAloud(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs focus:ring-4 focus:ring-purple-400"
                        aria-label={`Listen to AI evaluation aloud for ${rec.topicTitle}`}
                        title="Listen to AI evaluation aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Listen Aloud</span>
                      </button>
                    )}

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                      className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-300"
                      aria-label={isExpanded ? 'Collapse evaluation details' : 'Expand evaluation details'}
                      title={isExpanded ? 'Collapse details' : 'View details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleDelete(rec)}
                      disabled={isDeletingId === rec.id}
                      className="p-2.5 rounded-xl text-rose-600 hover:text-rose-800 hover:bg-rose-50 border border-rose-200 disabled:opacity-50"
                      aria-label={`Delete practice recording for ${rec.topicTitle}`}
                      title="Delete recording"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar when currently playing */}
                {isPlaying && (
                  <div className="w-full bg-blue-100 h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-100"
                      style={{ width: `${playbackProgress}%` }}
                    />
                  </div>
                )}

                {/* Expanded AI Evaluation Breakdown */}
                {isExpanded && (
                  <div className="p-5 md:p-6 bg-white space-y-5 animate-in fade-in">
                    {evalData ? (
                      evalData.isReliable ? (
                        <>
                          {/* Transcribed Speech */}
                          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                              What the AI heard you say (Accurate Transcript)
                            </span>
                            <p className="text-base font-bold text-slate-900 italic">
                              "{evalData.transcript}"
                            </p>
                          </div>

                          {/* Scores Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="p-3.5 rounded-xl bg-blue-50 border-2 border-blue-200 text-center space-y-0.5">
                              <span className="text-xs font-bold text-blue-800 uppercase">
                                Pronunciation Clarity
                              </span>
                              <div className="text-2xl font-black text-blue-950">
                                {evalData.clarityScore} / 5
                              </div>
                              <span className="text-xs text-blue-700 font-semibold">
                                {evalData.clarityScore >= 4 ? 'Very Clear' : evalData.clarityScore >= 3 ? 'Good effort' : 'Needs practice'}
                              </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-purple-50 border-2 border-purple-200 text-center space-y-0.5">
                              <span className="text-xs font-bold text-purple-800 uppercase">
                                Beginner Grammar
                              </span>
                              <div className="text-2xl font-black text-purple-950">
                                {evalData.grammarScore} / 5
                              </div>
                              <span className="text-xs text-purple-700 font-semibold">
                                {evalData.grammarScore >= 4 ? 'Great structure' : 'Good attempt'}
                              </span>
                            </div>

                            <div className="p-3.5 rounded-xl bg-emerald-50 border-2 border-emerald-200 text-center space-y-0.5">
                              <span className="text-xs font-bold text-emerald-800 uppercase">
                                Answer Relevance
                              </span>
                              <div className="text-2xl font-black text-emerald-950">
                                {evalData.relevanceScore} / 5
                              </div>
                              <span className="text-xs text-emerald-700 font-semibold">
                                On Topic
                              </span>
                            </div>
                          </div>

                          {/* Qualitative Feedback Sections */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Positive Praise */}
                            <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-emerald-900 font-black text-sm">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                <span>What you did well</span>
                              </div>
                              <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                                {evalData.positiveFeedback}
                              </p>
                            </div>

                            {/* Gentle Correction */}
                            <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300 space-y-1.5">
                              <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                                <span>Gentle improvement tip</span>
                              </div>
                              <p className="text-sm font-semibold text-amber-950 leading-relaxed">
                                {evalData.gentleCorrection}
                              </p>
                            </div>
                          </div>

                          {/* Next Practice Tip */}
                          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                            <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <span className="text-xs font-black uppercase text-blue-900 tracking-wider">
                                Recommended Next Speaking Practice
                              </span>
                              <p className="text-sm font-semibold text-blue-950">
                                {evalData.nextPracticeTip}
                              </p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
                          <div className="flex items-center gap-2 font-black text-sm text-rose-900">
                            <AlertCircle className="w-5 h-5 text-rose-700" />
                            <span>Audio Could Not Be Reliably Evaluated</span>
                          </div>
                          <p className="text-sm font-medium">
                            {evalData.unclearReason || 'The recording was too quiet or did not contain clear spoken English. Please try recording again closer to your microphone.'}
                          </p>
                        </div>
                      )
                    ) : (
                      <p className="text-sm text-slate-500 italic">
                        Evaluation data is not available for this recording.
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
