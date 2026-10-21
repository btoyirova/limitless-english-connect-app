import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  Sparkles, 
  Lightbulb, 
  PhoneCall, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  MessageSquare, 
  HelpCircle, 
  Repeat, 
  Check, 
  Loader2, 
  Award, 
  BookmarkPlus, 
  History,
  AlertCircle,
  Coins,
  ArrowRight
} from 'lucide-react';
import { ConversationTopic, User, PracticeRecording, SpeakingEvaluation } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { AudioRecorder, RecordResult } from '../services/audioRecorder';
import { storage } from '../services/storage';
import { supabaseService } from '../services/supabase';
import { evaluateStudentSpeech } from '../services/speechEvaluation';
import { avatarService } from '../services/avatarService';
import { achievementService } from '../services/achievementService';
import { TopicTest } from '../types/achievements';
import { PracticeHistorySection } from '../components/PracticeHistorySection';
import { TopicTestModal } from '../components/TopicTestModal';
import { InteractiveActivitiesSection } from '../components/InteractiveActivitiesSection';
import { TopicSingleLessonView } from '../components/TopicSingleLessonView';

interface TopicDetailViewProps {
  topic: ConversationTopic;
  currentUser: User;
  partner: User | null;
  onBack: () => void;
  onOpenCall: () => void;
  onNavigateToMessages: () => void;
}

export const TopicDetailView: React.FC<TopicDetailViewProps> = ({
  topic,
  currentUser,
  partner,
  onBack,
  onOpenCall,
  onNavigateToMessages
}) => {
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedResult, setRecordedResult] = useState<RecordResult | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedActivities, setCompletedActivities] = useState<Record<number, boolean>>({});
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  // Topic Test State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<TopicTest | null>(null);
  const [isTestPassed, setIsTestPassed] = useState(false);

  // Subscribe to speech state for centralized toggle Play / Stop
  useEffect(() => {
    const unsub = speechService.subscribe((isSpeaking, _, currentId) => {
      setActiveSpeechId(isSpeaking ? currentId : null);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const test = achievementService.getTopicTest(topic.id);
    setCurrentTest(test);
    checkTestStatus();
  }, [topic.id, currentUser.id]);

  // Load genuine completed lessons for this topic from student's profile
  useEffect(() => {
    let isMounted = true;
    avatarService.getProfile(currentUser.id).then((profile) => {
      if (!isMounted) return;
      const doneMap: Record<string, boolean> = {};
      topic.lessons?.forEach((lesson) => {
        const key = `lesson-${topic.id}-${lesson.id}`;
        if (profile.completedActivityKeys.includes(key)) {
          doneMap[lesson.id] = true;
        }
      });
      setCompletedLessons(doneMap);
    });
    return () => {
      isMounted = false;
    };
  }, [topic.id, currentUser.id]);

  const checkTestStatus = async () => {
    try {
      const ach = await achievementService.getAchievements(currentUser.id);
      setIsTestPassed(ach.completedTopicIds.includes(topic.id));
    } catch {
      // ignore
    }
  };

  const handleOpenTest = () => {
    soundEffects.playClick();
    if (!currentTest) {
      const test = achievementService.getTopicTest(topic.id);
      setCurrentTest(test);
    }
    setIsTestModalOpen(true);
    speechService.announce(`Opening End of Topic Test for ${topic.title}. 5 questions total: 2 listening, 2 vocabulary, and 1 speaking challenge.`);
  };

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const currentPrompt = topic.prompts[selectedPromptIndex] || topic.prompts[0];

  // Speech helper: Speak and chime
  const playSpokenAudio = (text: string, label?: string) => {
    soundEffects.playClick();
    if (label) {
      speechService.announce(label);
    }
    speechService.speak(text, true);
  };

  const handleReadFullGuide = () => {
    soundEffects.playClick();
    const overview = `${topic.title}. Level: ${topic.level || 'Beginner'}. Learning objective: ${topic.learningObjective}. ${topic.audioInstruction}`;
    speechService.toggleSpeak('topic-overview', overview);
  };

  const handleReadLessonItems = (lessonTitle: string, items: string[]) => {
    soundEffects.playClick();
    speechService.toggleSpeak(`lesson-items-${lessonTitle}`, `${lessonTitle}. Listen carefully: ${items.join('. ')}`);
  };

  const handleReadDialogue = () => {
    soundEffects.playClick();
    if (!topic.dialogue || topic.dialogue.length === 0) return;
    const lines = topic.dialogue.map(d => `${d.speaker} says: ${d.text}`).join('. ');
    speechService.toggleSpeak(`dialogue-${topic.id}`, `Example conversation for ${topic.title}. ${lines}`);
  };

  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});

  const handleLessonCompleted = (lessonId: string, coinsEarned: number) => {
    setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
    if (coinsEarned > 0) {
      soundEffects.playSuccess();
    }
  };

  // Study guide checklist: student personal tracking without unearned coin dispensing
  const toggleActivityComplete = (index: number) => {
    soundEffects.playClick();
    const isNowDone = !completedActivities[index];

    setCompletedActivities(prev => {
      const next = { ...prev, [index]: isNowDone };
      const count = Object.values(next).filter(Boolean).length;
      if (count === (topic.speakingActivities?.length || 5)) {
        setIsCompleted(true);
        speechService.announce(topic.completionMessage || 'Speaking practice checklist completed!');
      } else {
        speechService.announce(`Activity ${index + 1} marked ${isNowDone ? 'completed' : 'incomplete'}.`);
      }
      return next;
    });
  };

  // Recording actions using real microphone MediaRecorder
  const handleStartRecording = async () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }
    setIsPlayingPreview(false);
    setPreviewProgress(0);
    setRecordedResult(null);
    setSentSuccess(false);
    setErrorMessage(null);

    try {
      setIsRecording(true);
      speechService.announce(`Recording your speaking answer for ${topic.title}. Speak clearly into your microphone.`);
      await recorderRef.current.startRecording((vol) => setVolumeLevel(vol));
    } catch (err) {
      setIsRecording(false);
      const msg = err instanceof Error ? err.message : 'Failed to access microphone.';
      setErrorMessage(msg);
      soundEffects.playWarning();
      speechService.announce(`Microphone error: ${msg}`);
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setRecordedResult(result);
      setErrorMessage(null);
      speechService.announce(`Recording stopped. Duration: ${result.durationSeconds} seconds. You can preview, re-record, or send to your speaking partner.`);
    } catch (err) {
      setIsRecording(false);
      const msg = err instanceof Error ? err.message : 'Failed to save recording.';
      setErrorMessage(msg);
      soundEffects.playWarning();
      speechService.announce(`Recording error: ${msg}`);
    }
  };

  const handleTogglePlayPreview = () => {
    if (!recordedResult) return;

    if (!audioPreviewRef.current) {
      const audio = new Audio(recordedResult.audioUrl);
      audioPreviewRef.current = audio;

      audio.onended = () => {
        setIsPlayingPreview(false);
        setPreviewProgress(0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0) {
          const pct = (audio.currentTime / audio.duration) * 100;
          setPreviewProgress(pct || 0);
        }
      };

      audio.onerror = () => {
        setIsPlayingPreview(false);
        setErrorMessage('Unable to play back audio recording in this browser.');
      };
    }

    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      soundEffects.playClick();
      audioPreviewRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch(() => {
        setIsPlayingPreview(false);
        setErrorMessage('Audio playback was prevented by your browser. Please tap play again.');
      });
    }
  };

  const handleResetRecording = () => {
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }
    setIsPlayingPreview(false);
    setPreviewProgress(0);
    setRecordedResult(null);
    setErrorMessage(null);
  };

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<SpeakingEvaluation | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [practiceRecordings, setPracticeRecordings] = useState<PracticeRecording[]>(() => {
    return storage.getPracticeRecordings(currentUser.id);
  });
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load recordings on mount and sync with Supabase if configured
  useEffect(() => {
    const loadRecordings = async () => {
      setIsLoadingHistory(true);
      const local = storage.getPracticeRecordings(currentUser.id);
      setPracticeRecordings(local);

      if (supabaseService.isConfigured()) {
        try {
          const remote = await supabaseService.fetchPracticeRecordingsFromDb(currentUser.id);
          if (remote && remote.length > 0) {
            // Merge remote into state and localStorage
            remote.forEach(r => storage.savePracticeRecording(r));
            setPracticeRecordings(storage.getPracticeRecordings(currentUser.id));
          }
        } catch {
          // Keep local
        }
      }
      setIsLoadingHistory(false);
    };

    loadRecordings();
  }, [currentUser.id]);

  const handleRefreshHistory = async () => {
    setIsLoadingHistory(true);
    let list = storage.getPracticeRecordings(currentUser.id);
    if (supabaseService.isConfigured()) {
      try {
        const remote = await supabaseService.fetchPracticeRecordingsFromDb(currentUser.id);
        if (remote && remote.length > 0) {
          remote.forEach(r => storage.savePracticeRecording(r));
          list = storage.getPracticeRecordings(currentUser.id);
        }
      } catch {
        // continue
      }
    }
    setPracticeRecordings(list);
    setIsLoadingHistory(false);
    speechService.announce(`Practice history refreshed. ${list.length} recordings found.`);
  };

  const handleDeletePracticeRecording = async (id: string, storagePath?: string) => {
    storage.deletePracticeRecording(id);
    setPracticeRecordings(prev => prev.filter(r => r.id !== id));
    if (supabaseService.isConfigured()) {
      await supabaseService.deletePracticeRecordingFromDb(id, storagePath);
    }
  };

  const handleSendToPartner = () => {
    if (!recordedResult || !partner) return;
    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }
    setIsPlayingPreview(false);
    soundEffects.playMessageSent();

    storage.addVoiceMessage({
      conversationId: `${currentUser.id}_${partner.id}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      receiverId: partner.id,
      audioUrl: recordedResult.audioUrl,
      durationSeconds: recordedResult.durationSeconds,
      topicId: topic.id,
      transcript: `[Practice recording for ${topic.title}]: "${currentPrompt.question}"`
    });

    setSentSuccess(true);
    speechService.announce(`Voice message sent to ${partner.name}!`);
    setTimeout(() => {
      setSentSuccess(false);
      handleResetRecording();
    }, 2800);
  };

  // 1 & 2: Save and Evaluate feature
  const handleSaveAndEvaluate = async () => {
    if (!recordedResult) return;

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
      audioPreviewRef.current = null;
    }
    setIsPlayingPreview(false);
    setIsEvaluating(true);
    setEvaluationError(null);
    setSaveSuccessMessage(null);

    soundEffects.playClick();
    speechService.announce('Evaluating your speaking answer with AI. Please wait a moment.');

    try {
      // 1. Send real audio to server-side Gemini speech evaluation endpoint
      const evaluation = await evaluateStudentSpeech({
        audioBlob: recordedResult.blob,
        question: currentPrompt.question,
        topicTitle: topic.title,
        expectedLevel: topic.level,
      });

      setEvaluationResult(evaluation);

      // 2. Upload to Supabase Storage if configured, or use Blob audioUrl/data URI
      let audioStorageUrl = recordedResult.audioUrl;
      let storagePath: string | undefined = undefined;

      if (supabaseService.isConfigured()) {
        const uploadRes = await supabaseService.uploadPracticeAudio(
          currentUser.id,
          topic.id,
          recordedResult.blob
        );
        if (uploadRes) {
          audioStorageUrl = uploadRes.audioUrl;
          storagePath = uploadRes.storagePath;
        }
      }

      // 3. Create persistent PracticeRecording object associated with student, topic, question, and submission time
      const newPracticeRec: PracticeRecording = {
        id: `rec-${Date.now()}`,
        studentId: currentUser.id,
        studentName: currentUser.name,
        topicId: topic.id,
        topicTitle: topic.title,
        questionId: currentPrompt.id,
        questionText: currentPrompt.question,
        audioUrl: audioStorageUrl,
        storagePath,
        durationSeconds: recordedResult.durationSeconds,
        submittedAt: new Date().toISOString(),
        evaluation,
      };

      // 4. Save to local storage and Supabase database if connected
      storage.savePracticeRecording(newPracticeRec);
      if (supabaseService.isConfigured()) {
        await supabaseService.savePracticeRecordingToDb(newPracticeRec);
      }

      setPracticeRecordings(prev => [newPracticeRec, ...prev.filter(r => r.id !== newPracticeRec.id)]);
      soundEffects.playSuccess();
      setSaveSuccessMessage('Recording saved and evaluated successfully!');

      // Award 10 English Coins for speaking practice activity
      await avatarService.awardCoins(
        currentUser.id,
        10,
        `practice-eval-${topic.id}-${currentPrompt.id}`,
        `Speaking Practice on "${currentPrompt.question}"`
      );

      // Read spoken summary aloud for blind/low-vision learner
      if (evaluation.isReliable) {
        speechService.announce(
          `Evaluation complete! Clarity score: ${evaluation.clarityScore} of 5. ${evaluation.spokenSummary}`
        );
      } else {
        speechService.announce(
          `Evaluation note: ${evaluation.unclearReason || 'Audio was unclear. Please try recording again.'}`
        );
      }
    } catch (err: any) {
      console.error('Save and evaluate error:', err);
      const msg = err instanceof Error ? err.message : 'Evaluation service error.';
      setEvaluationError(msg);
      soundEffects.playWarning();
      speechService.announce(`Evaluation could not be completed: ${msg}`);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Dedicated Single Lesson View when a lesson is clicked
  if (selectedLessonId) {
    const currentLesson = topic.lessons.find((l) => l.id === selectedLessonId) || topic.lessons[0];
    const currentIndex = topic.lessons.findIndex((l) => l.id === currentLesson.id);
    const prevLesson = currentIndex > 0 ? topic.lessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < topic.lessons.length - 1 ? topic.lessons[currentIndex + 1] : null;
    const isLessonDone = Boolean(completedLessons[currentLesson.id]);

    return (
      <TopicSingleLessonView
        topic={topic}
        lesson={currentLesson}
        lessonIndex={currentIndex}
        totalLessons={topic.lessons.length}
        prevLesson={prevLesson}
        nextLesson={nextLesson}
        isCompleted={isLessonDone}
        onLessonCompleted={handleLessonCompleted}
        onBackToMenu={() => {
          soundEffects.playClick();
          setSelectedLessonId(null);
          speechService.announce(`Returned to lesson menu for ${topic.title}`);
        }}
        onSelectLesson={(lessonId) => {
          soundEffects.playClick();
          setSelectedLessonId(lessonId);
        }}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in pb-12">
      {/* Top Navigation & Back */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-300 hover:border-blue-500 text-slate-800 font-extrabold text-sm focus:ring-4 focus:ring-blue-600 cursor-pointer"
          aria-label="Back to all topics"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Topics</span>
        </button>

        <div className="flex items-center gap-2">
          {currentUser.isApproved && partner && (
            <button
              onClick={onOpenCall}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-xs focus:ring-4 focus:ring-emerald-400 cursor-pointer"
              aria-label={`Call ${partner.name} for live speaking practice on this topic`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Partner: {partner.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Topic Hero Banner */}
      <section 
        className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-6 md:p-8 border-4 border-blue-700 shadow-xl space-y-4"
        aria-labelledby="topic-title"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-black uppercase tracking-wider">
                {topic.levelGroup || 'Level 1'} • {topic.level || 'Pre-A1 to A1'}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-extrabold">
                {topic.lessons?.length || 5} Clickable Lessons
              </span>
            </div>
            <h1 id="topic-title" className="text-3xl md:text-4xl font-black tracking-tight" lang="en">
              {topic.title}
            </h1>
            {topic.titleUz && (
              <p className="text-xl font-bold text-amber-300" lang="uz">
                {topic.titleUz}
              </p>
            )}
            <p className="text-base text-blue-100 font-medium leading-relaxed" lang="en">
              <strong>Learning Objective:</strong> {topic.learningObjective || topic.subtitle}
            </p>
            {topic.learningObjectiveUz && (
              <p className="text-xs md:text-sm text-teal-200 font-medium leading-relaxed" lang="uz">
                <strong>O‘rganish maqsadi:</strong> {topic.learningObjectiveUz}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleReadFullGuide}
              className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-md focus:ring-4 active:scale-95 transition-all cursor-pointer ${
                activeSpeechId === 'topic-overview'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-300 ring-2 ring-rose-200'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950 focus:ring-amber-200'
              }`}
              aria-label={
                activeSpeechId === 'topic-overview'
                  ? 'Stop spoken introduction audio'
                  : 'Listen to spoken introduction and lesson objective in English'
              }
            >
              {activeSpeechId === 'topic-overview' ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-amber-950" />
                  <span>Listen in English</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Clickable Topic Lessons Menu */}
      {topic.lessons && topic.lessons.length > 0 && (
        <section 
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
          aria-labelledby="lessons-menu-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-700" />
                <h2 id="lessons-menu-heading" className="text-2xl font-black text-slate-900">
                  Topic Lessons ({topic.lessons.length} Lessons Available)
                </h2>
              </div>
              <p className="text-sm text-slate-600 font-medium">
                Click any lesson below to open it individually. Study vocabulary, sentence structures, and speaking practice step by step.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-black self-start sm:self-auto">
              Select a Lesson
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" role="list" aria-label="Topic lessons menu">
            {topic.lessons.map((lesson, lIdx) => {
              const isDone = completedLessons[lesson.id];
              return (
                <div
                  key={lesson.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedLessonId(lesson.id);
                    speechService.announce(`Opening ${lesson.title}`);
                  }}
                  className={`group p-6 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-lg ${
                    isDone
                      ? 'bg-emerald-50/60 border-emerald-300 hover:border-emerald-500'
                      : 'bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50/30'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      soundEffects.playClick();
                      setSelectedLessonId(lesson.id);
                    }
                  }}
                  aria-label={`Open ${lesson.title}. Status: ${isDone ? 'Completed' : 'Not completed'}`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200 group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors">
                        Lesson {lIdx + 1}
                      </span>
                      {isDone ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          +20 Coins
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors" lang="en">
                        {lesson.title}
                      </h3>
                      {lesson.titleUz && (
                        <p className="text-sm font-bold text-teal-800 mt-1" lang="uz">
                          {lesson.titleUz}
                        </p>
                      )}
                    </div>

                    {lesson.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed" lang="en">
                        {lesson.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs font-bold text-slate-500">
                      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                          {lesson.vocabulary.length} Words
                        </span>
                      )}
                      {lesson.sentences && lesson.sentences.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200">
                          {lesson.sentences.length} Patterns
                        </span>
                      )}
                      {lesson.items && lesson.items.length > 0 && (!lesson.vocabulary || lesson.vocabulary.length === 0) && (
                        <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200">
                          {lesson.items.length} Phrases
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-blue-700 group-hover:translate-x-1 transition-transform">
                    <span>Open Lesson {lIdx + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Example Conversation Dialogue */}
      {topic.dialogue && topic.dialogue.length > 0 && (
        <section 
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-4"
          aria-labelledby="dialogue-heading"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-teal-700" />
              <h2 id="dialogue-heading" className="text-2xl font-black text-slate-900">
                Example Conversation
              </h2>
            </div>
            <button
              onClick={handleReadDialogue}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-xs flex items-center gap-2 shadow-xs focus:ring-4 focus:ring-teal-400"
              aria-label="Listen to example dialogue aloud"
            >
              <Volume2 className="w-4 h-4" />
              <span>Listen to Conversation</span>
            </button>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto py-2">
            {topic.dialogue.map((line, idx) => {
              const isAnna = line.speaker.toLowerCase().includes('anna');
              return (
                <div 
                  key={idx}
                  className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                    isAnna 
                      ? 'bg-blue-50/70 border-blue-200 mr-8' 
                      : 'bg-emerald-50/70 border-emerald-200 ml-8'
                  }`}
                >
                  <div>
                    <span className={`block text-xs font-black uppercase tracking-wider ${isAnna ? 'text-blue-800' : 'text-emerald-800'}`}>
                      {line.speaker}
                    </span>
                    <p className="text-base md:text-lg font-bold text-slate-900 mt-0.5">
                      "{line.text}"
                    </p>
                  </div>
                  <button
                    onClick={() => playSpokenAudio(line.text, `${line.speaker} says: ${line.text}`)}
                    className="p-2 rounded-xl text-slate-700 hover:bg-white hover:text-blue-700 border border-transparent hover:border-slate-300 focus:ring-2 focus:ring-blue-400 shrink-0 mt-0.5"
                    aria-label={`Listen to ${line.speaker}: "${line.text}"`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Speaking Activities Checklist */}
      {topic.speakingActivities && topic.speakingActivities.length > 0 && (
        <section 
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-4"
          aria-labelledby="activities-heading"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <h2 id="activities-heading" className="text-2xl font-black text-slate-900">
                Speaking Activities ({Object.values(completedActivities).filter(Boolean).length}/{topic.speakingActivities.length})
              </h2>
            </div>
            <button
              onClick={() => {
                soundEffects.playClick();
                speechService.speak(`Speaking activities for this unit: ${topic.speakingActivities.join('. ')}`, true);
              }}
              className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              aria-label="Listen to all speaking activities"
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Activities Aloud</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="list">
            {topic.speakingActivities.map((act, aIdx) => {
              const done = completedActivities[aIdx];
              return (
                <div 
                  key={aIdx}
                  onClick={() => toggleActivityComplete(aIdx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    done 
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-950' 
                      : 'bg-slate-50 border-slate-200 hover:border-blue-400 text-slate-900'
                  }`}
                  role="checkbox"
                  aria-checked={Boolean(done)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      toggleActivityComplete(aIdx);
                    }
                  }}
                  aria-label={`Activity ${aIdx + 1}: ${act}. Status: ${done ? 'Completed' : 'Not completed'}. Press space or enter to toggle.`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {done ? <Check className="w-4 h-4" /> : aIdx + 1}
                    </div>
                    <span className="text-sm md:text-base font-bold">
                      {act}
                    </span>
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider opacity-75">
                    {done ? 'Done' : 'Tap'}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Main Question & Speaking Support Card */}
      <section 
        className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
        aria-labelledby="question-heading"
      >
        {/* Prompt Selector Tabs */}
        {topic.prompts.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Questions in this topic">
            {topic.prompts.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  soundEffects.playClick();
                  setSelectedPromptIndex(idx);
                  speechService.announce(`Selected question ${idx + 1}`);
                }}
                role="tab"
                aria-selected={selectedPromptIndex === idx}
                className={`px-5 py-3 rounded-2xl font-black text-sm transition-all border-2 whitespace-nowrap ${
                  selectedPromptIndex === idx
                    ? 'bg-blue-700 text-white border-blue-800 shadow-md'
                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
                }`}
              >
                Question {idx + 1} {p.optional ? '(Optional)' : ''}
              </button>
            ))}
          </div>
        )}

        {/* The Question Card */}
        <div className="p-6 rounded-2xl bg-blue-50 border-2 border-blue-300 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-800">
                Practice Question #{selectedPromptIndex + 1}
              </span>
              {currentPrompt.optional && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold">
                  Optional Question
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {currentPrompt.optional && (
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    const nextIdx = (selectedPromptIndex + 1) % topic.prompts.length;
                    setSelectedPromptIndex(nextIdx);
                    speechService.announce(`Skipped question. Moving to question ${nextIdx + 1}.`);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
                  aria-label="Skip this personal question"
                >
                  Skip Question
                </button>
              )}
              <button
                onClick={() => playSpokenAudio(currentPrompt.question, 'Listening to question')}
                className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 focus:ring-4 focus:ring-blue-400"
                aria-label="Listen to this question"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Question</span>
              </button>
            </div>
          </div>

          <h2 id="question-heading" className="text-2xl md:text-3xl font-black text-slate-900 leading-snug">
            "{currentPrompt.question}"
          </h2>
        </div>

        {/* Sentence Starters */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-black text-slate-900">
              Sentence Starters (How you can begin your answer)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" role="list" aria-label="Sentence starters">
            {currentPrompt.sentenceStarters.map((starter, sIdx) => (
              <div
                key={sIdx}
                className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3 hover:border-blue-400 transition-colors"
                role="listitem"
              >
                <span className="text-sm md:text-base font-bold text-slate-800">
                  "{starter}"
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => playSpokenAudio(starter, `Listening to starter: ${starter}`)}
                    className="p-2 rounded-xl text-blue-700 hover:bg-blue-100 focus:ring-4 focus:ring-blue-400"
                    aria-label={`Listen to sentence starter: ${starter}`}
                    title="Listen"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => playSpokenAudio(starter, `Repeating: ${starter}`)}
                    className="p-2 rounded-xl text-teal-700 hover:bg-teal-100 focus:ring-4 focus:ring-teal-400"
                    aria-label={`Repeat sentence starter: ${starter}`}
                    title="Repeat"
                  >
                    <Repeat className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Example Answer */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border-2 border-amber-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Model Example Answer
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playSpokenAudio(currentPrompt.exampleAnswer, 'Model example answer')}
                className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 focus:ring-4 focus:ring-amber-400"
                aria-label="Listen to model example answer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen</span>
              </button>
              <button
                onClick={() => playSpokenAudio(currentPrompt.exampleAnswer, 'Repeating model example answer')}
                className="px-3 py-1.5 rounded-xl bg-amber-200 text-amber-900 hover:bg-amber-300 font-bold text-xs flex items-center gap-1 focus:ring-2 focus:ring-amber-500"
                aria-label="Repeat model example answer"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Repeat</span>
              </button>
            </div>
          </div>

          <p className="text-base md:text-lg text-slate-800 font-semibold italic">
            "{currentPrompt.exampleAnswer}"
          </p>
        </div>

        {/* Teacher Tip */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-start gap-3">
          <Lightbulb className="w-6 h-6 text-purple-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                Teacher's Speaking Tip
              </span>
              <button
                onClick={() => playSpokenAudio(currentPrompt.teacherTip, 'Teacher tip')}
                className="text-xs font-bold text-purple-800 hover:underline flex items-center gap-1"
                aria-label="Listen to teacher tip"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Listen</span>
              </button>
            </div>
            <p className="text-sm font-medium text-purple-950 mt-1">
              {currentPrompt.teacherTip}
            </p>
          </div>
        </div>
      </section>

      {/* Real Voice Recorder Activity */}
      <section 
        className="bg-white rounded-3xl p-6 md:p-8 border-4 border-blue-500 shadow-xl space-y-6"
        aria-labelledby="practice-recorder-heading"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Voice Recording Activity
            </span>
            <h2 id="practice-recorder-heading" className="text-2xl font-black text-slate-900">
              Record Your Voice for this Topic
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Press the big microphone button to practice speaking your answer. Your real voice will be captured and played back.
            </p>
          </div>

          {currentUser.isApproved && partner && (
            <div className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              Optional Partner: <strong className="text-slate-900">{partner.name}</strong>
            </div>
          )}
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div 
            className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-sm font-bold flex items-center justify-between gap-3 animate-in fade-in" 
            role="alert"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-700 underline font-extrabold hover:text-rose-900 px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Record Control Area */}
        <div className="py-6 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-slate-200 text-center">
          {!isRecording && !recordedResult && (
            <div className="space-y-4">
              <button
                onClick={handleStartRecording}
                className="w-24 h-24 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-xl hover:shadow-2xl border-4 border-white ring-4 ring-rose-200 active:scale-95 transition-all mx-auto"
                aria-label="Start recording your English answer. Keyboard shortcut: Spacebar or Alt R"
              >
                <Mic className="w-10 h-10" />
              </button>
              <div className="space-y-1">
                <span className="block text-lg font-black text-slate-900">
                  Ready to Record
                </span>
                <span className="block text-xs font-semibold text-slate-500">
                  Click the red microphone to speak
                </span>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="relative">
                <button
                  onClick={handleStopRecording}
                  className="w-24 h-24 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-2xl border-4 border-white ring-8 ring-rose-300 animate-pulse active:scale-95 transition-all mx-auto"
                  aria-label="Stop recording your answer"
                >
                  <Square className="w-10 h-10 fill-current" />
                </button>
              </div>

              {/* Volume meter visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-10">
                <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-1" />
                <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-2" />
                <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-3" />
                <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-4" />
                <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-5" />
              </div>

              <span className="block text-base font-black text-rose-700 animate-pulse">
                Recording your real voice... Click to Stop!
              </span>
            </div>
          )}

          {/* Recorded Result & Playback */}
          {recordedResult && (
            <div className="w-full max-w-md px-4 space-y-4">
              {sentSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-950 font-black flex items-center justify-center gap-2" role="alert">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                  <span>Your voice answer was sent to {partner ? partner.name : 'your profile'}!</span>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-white border-2 border-blue-400 shadow-sm flex items-center justify-between gap-4">
                    <button
                      onClick={handleTogglePlayPreview}
                      className="w-12 h-12 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shrink-0 focus:ring-4 focus:ring-blue-400"
                      aria-label={isPlayingPreview ? 'Pause playback of your recording' : 'Play back your recorded answer'}
                    >
                      {isPlayingPreview ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                    </button>

                    <div className="flex-1 text-left">
                      <span className="block text-xs font-bold text-slate-500">
                        Your Real Voice Recording
                      </span>
                      <span className="block text-sm font-extrabold text-slate-900">
                        {recordedResult.durationSeconds} seconds
                      </span>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1.5">
                        <div
                          className="bg-blue-600 h-full transition-all"
                          style={{ width: `${previewProgress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundEffects.playClick();
                        handleResetRecording();
                      }}
                      className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      aria-label="Re-record answer"
                      title="Re-record"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Save and Evaluate Action Bar */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSaveAndEvaluate}
                      disabled={isEvaluating}
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-black text-base md:text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-purple-400 active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                      aria-label="Save and Evaluate your recorded voice answer with AI"
                    >
                      {isEvaluating ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-purple-200" />
                          <span>AI is Evaluating Your Speaking...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 text-amber-300" />
                          <span>Save and Evaluate</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleResetRecording}
                        disabled={isEvaluating}
                        className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-50 text-sm"
                      >
                        Record Again
                      </button>

                      {currentUser.isApproved && partner && (
                        <button
                          onClick={handleSendToPartner}
                          disabled={isEvaluating}
                          className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold flex items-center justify-center gap-2 shadow-sm focus:ring-4 focus:ring-blue-500 disabled:opacity-50 text-sm"
                          aria-label={`Send voice practice to speaking partner ${partner.name}`}
                        >
                          <Send className="w-4 h-4" />
                          <span>Send to {partner.name}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Evaluation in-progress notice */}
                  {isEvaluating && (
                    <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200 text-purple-950 text-sm font-semibold flex items-center gap-3 animate-pulse" role="status">
                      <Loader2 className="w-5 h-5 text-purple-700 animate-spin shrink-0" />
                      <span>Transcribing your real speech and preparing constructive beginner feedback...</span>
                    </div>
                  )}

                  {/* Evaluation error alert */}
                  {evaluationError && (
                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-sm font-bold flex items-start gap-2.5" role="alert">
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="block font-black">Evaluation could not be completed:</span>
                        <span className="block font-medium">{evaluationError}</span>
                      </div>
                    </div>
                  )}

                  {/* Save success banner */}
                  {saveSuccessMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 text-sm font-bold flex items-center gap-2.5" role="alert">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      <span>{saveSuccessMessage} Saved to "My Speaking Practice" below.</span>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Live Evaluation Result Card (When freshly evaluated) */}
        {evaluationResult && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border-3 border-purple-300 shadow-md space-y-5 animate-in fade-in" aria-labelledby="eval-result-heading">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-700" />
                <h3 id="eval-result-heading" className="text-xl font-black text-purple-950">
                  AI Speaking Evaluation Result
                </h3>
              </div>
              <button
                onClick={() => {
                  soundEffects.playClick();
                  if (evaluationResult.isReliable) {
                    const text = `AI Speaking Evaluation for ${topic.title}. ` +
                      `Your answer: ${evaluationResult.transcript}. ` +
                      `Pronunciation clarity score: ${evaluationResult.clarityScore} of 5. ` +
                      `Beginner grammar score: ${evaluationResult.grammarScore} of 5. ` +
                      `Relevance score: ${evaluationResult.relevanceScore} of 5. ` +
                      `What you did well: ${evaluationResult.positiveFeedback}. ` +
                      `Gentle tip: ${evaluationResult.gentleCorrection}. ` +
                      `Next practice: ${evaluationResult.nextPracticeTip}`;
                    speechService.speak(text, true);
                  } else {
                    speechService.speak(evaluationResult.unclearReason || 'Audio was unclear. Please record again.', true);
                  }
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm focus:ring-4 focus:ring-purple-400"
                aria-label="Listen to entire evaluation aloud"
              >
                <Volume2 className="w-4 h-4" />
                <span>Listen to Evaluation Aloud</span>
              </button>
            </div>

            {evaluationResult.isReliable ? (
              <>
                {/* Transcript */}
                <div className="p-4 rounded-xl bg-white border-2 border-purple-200 space-y-1">
                  <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                    What The AI Heard (Transcript)
                  </span>
                  <p className="text-lg font-bold text-slate-900 italic">
                    "{evaluationResult.transcript}"
                  </p>
                </div>

                {/* Score Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white border-2 border-blue-200 text-center space-y-1">
                    <span className="text-xs font-black text-blue-900 uppercase">
                      Pronunciation Clarity
                    </span>
                    <div className="text-3xl font-black text-blue-700">
                      {evaluationResult.clarityScore} / 5
                    </div>
                    <span className="text-xs text-slate-600 font-bold">
                      {evaluationResult.clarityScore >= 4 ? 'Very Clear' : evaluationResult.clarityScore >= 3 ? 'Good speaking' : 'Practice more'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border-2 border-purple-200 text-center space-y-1">
                    <span className="text-xs font-black text-purple-900 uppercase">
                      Beginner Grammar
                    </span>
                    <div className="text-3xl font-black text-purple-700">
                      {evaluationResult.grammarScore} / 5
                    </div>
                    <span className="text-xs text-slate-600 font-bold">
                      {evaluationResult.grammarScore >= 4 ? 'Great structure' : 'Good attempt'}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 text-center space-y-1">
                    <span className="text-xs font-black text-emerald-900 uppercase">
                      Answer Relevance
                    </span>
                    <div className="text-3xl font-black text-emerald-700">
                      {evaluationResult.relevanceScore} / 5
                    </div>
                    <span className="text-xs text-slate-600 font-bold">
                      Direct Answer
                    </span>
                  </div>
                </div>

                {/* Qualitative Feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white border-2 border-emerald-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-black text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>What you did well</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {evaluationResult.positiveFeedback}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-white border-2 border-amber-300 space-y-1">
                    <div className="flex items-center gap-1.5 text-amber-900 font-black text-sm">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Gentle improvement tip</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {evaluationResult.gentleCorrection}
                    </p>
                  </div>
                </div>

                {/* Next practice tip */}
                <div className="p-4 rounded-xl bg-white border-2 border-blue-300 flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-black uppercase text-blue-900">
                      Next Speaking Goal
                    </span>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      {evaluationResult.nextPracticeTip}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-base text-rose-900">
                  <AlertCircle className="w-5 h-5 text-rose-700" />
                  <span>Please Record Again</span>
                </div>
                <p className="text-sm font-medium">
                  {evaluationResult.unclearReason || 'The recording was unclear or quiet. Please speak closer to your microphone and try again.'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* "My Speaking Practice" History Section */}
      <PracticeHistorySection
        recordings={practiceRecordings}
        onDeleteRecording={handleDeletePracticeRecording}
        onRefresh={handleRefreshHistory}
        isLoading={isLoadingHistory}
      />

      {/* Lesson Completion Card */}
      <section 
        className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        aria-labelledby="completion-heading"
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-200" />
            <h2 id="completion-heading" className="text-2xl font-black">
              Unit Status: {topic.title}
            </h2>
          </div>
          <p className="text-sm md:text-base text-emerald-100 font-semibold leading-relaxed">
            {topic.completionMessage}
          </p>
        </div>

        <button
          onClick={() => {
            soundEffects.playSuccess();
            speechService.speak(topic.completionMessage, true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-900 font-black text-sm flex items-center gap-2.5 shadow-md hover:bg-emerald-50 focus:ring-4 focus:ring-emerald-200 shrink-0"
          aria-label="Listen to lesson completion message"
        >
          <Volume2 className="w-5 h-5 text-emerald-800" />
          <span>Listen to Completion Audio</span>
        </button>
      </section>
    </div>
  );
};
