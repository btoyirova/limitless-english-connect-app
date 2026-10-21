import React, { useState, useRef } from 'react';
import { 
  X, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Mic, 
  Square, 
  RotateCcw, 
  Award, 
  ArrowRight,
  Coins,
  Check,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { TopicTest, TestQuestion, Badge } from '../types/achievements';
import { User } from '../types';
import { achievementService } from '../services/achievementService';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { AudioRecorder, RecordResult } from '../services/audioRecorder';
import { BadgeGraphic } from './BadgeGraphic';

interface TopicTestModalProps {
  test: TopicTest;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
  onTestCompleted?: (passed: boolean, newBadges: Badge[]) => void;
}

export const TopicTestModal: React.FC<TopicTestModalProps> = ({
  test,
  currentUser,
  isOpen,
  onClose,
  onTestCompleted,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordedResult, setRecordedResult] = useState<RecordResult | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResult, setTestResult] = useState<{
    submitted: boolean;
    passed: boolean;
    scorePercentage: number;
    coinsAwarded: number;
    newBadges: Badge[];
    message: string;
  } | null>(null);

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  if (!isOpen) return null;

  const handleSpeakText = (text: string, label?: string) => {
    soundEffects.playClick();
    if (label) {
      speechService.announce(label);
    }
    speechService.speak(text, true);
  };

  const handleSelectOption = (questionId: string, optionId: string, optionText: string) => {
    soundEffects.playClick();
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    speechService.announce(`Selected option: ${optionText}`);
  };

  // Recording speaking challenge
  const handleStartRecording = async () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    setRecordedResult(null);

    try {
      setIsRecording(true);
      speechService.announce('Microphone recording started. Speak your answer clearly.');
      await recorderRef.current.startRecording();
    } catch (err) {
      setIsRecording(false);
      soundEffects.playWarning();
      speechService.announce('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setRecordedResult(result);
      soundEffects.playSuccess();
      speechService.announce(`Recording completed! Duration: ${result.durationSeconds} seconds. You can preview or submit.`);
    } catch (err) {
      setIsRecording(false);
      soundEffects.playWarning();
    }
  };

  const handleTogglePlayPreview = () => {
    if (!recordedResult) return;
    if (!previewAudioRef.current) {
      const audio = new Audio(recordedResult.audioUrl);
      previewAudioRef.current = audio;
      audio.onended = () => setIsPlayingPreview(false);
      audio.play();
      setIsPlayingPreview(true);
    } else {
      if (isPlayingPreview) {
        previewAudioRef.current.pause();
        setIsPlayingPreview(false);
      } else {
        previewAudioRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  const handleSubmitTest = async () => {
    soundEffects.playClick();
    setIsSubmitting(true);

    // Calculate score on the 4 objective questions
    const objectiveQuestions = test.questions.filter((q) => q.type !== 'speaking');
    let objectiveScore = 0;

    objectiveQuestions.forEach((q) => {
      const selectedId = selectedAnswers[q.id];
      const correctOpt = q.options?.find((o) => o.isCorrect);
      if (correctOpt && selectedId === correctOpt.id) {
        objectiveScore += 1;
      }
    });

    const speakingCompleted = !!recordedResult;

    const result = await achievementService.submitTestAttempt(
      currentUser.id,
      test.topicId,
      objectiveScore,
      objectiveQuestions.length,
      speakingCompleted
    );

    setTestResult({
      submitted: true,
      passed: result.passed,
      scorePercentage: result.scorePercentage,
      coinsAwarded: result.coinsAwarded,
      newBadges: result.newBadges,
      message: result.message,
    });

    setIsSubmitting(false);

    if (onTestCompleted) {
      onTestCompleted(result.passed, result.newBadges);
    }
  };

  const handleRetry = () => {
    soundEffects.playClick();
    setSelectedAnswers({});
    setRecordedResult(null);
    setTestResult(null);
    speechService.announce('Test reset. You have unlimited retries with zero penalties. Good luck!');
  };

  // Questions breakdown
  const listeningQuestions = test.questions.filter((q) => q.type === 'listening');
  const vocabAndSentenceQuestions = test.questions.filter((q) => q.type === 'vocabulary' || q.type === 'sentence');
  const speakingQuestion = test.questions.find((q) => q.type === 'speaking');

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="test-dialog-title"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-4 border-slate-300 shadow-2xl p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <Award className="w-4 h-4 text-amber-600" />
              <span>End-of-Topic Mastery Test • Earn 30 Coins</span>
            </div>
            <h2 id="test-dialog-title" className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {test.topicTitle} Mastery Test
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Pass target: <strong className="text-slate-900">60%</strong> on objective questions + speaking participation. Unlimited free retries!
            </p>
          </div>

          <button
            onClick={() => {
              soundEffects.playClick();
              onClose();
            }}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:ring-4 focus:ring-blue-300"
            aria-label="Close test modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Spoken Overview Button */}
        <div className="flex items-center justify-between gap-3 p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
          <span className="text-xs md:text-sm font-bold text-blue-900">
            Audio Instructions: Listen to the questions and options aloud at any time.
          </span>
          <button
            type="button"
            onClick={() =>
              handleSpeakText(
                `Welcome to the ${test.topicTitle} End of Topic Test. This test has two listening questions, two vocabulary questions, and one short speaking challenge. Answer at your own pace. You need 60 percent to pass and earn the ${test.badge.name} badge and 30 English Coins.`
              )
            }
            className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shrink-0 focus:ring-4 focus:ring-blue-300"
            aria-label="Listen to test instructions aloud"
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>Read Instructions</span>
          </button>
        </div>

        {/* TEST RESULT CELEBRATION OR RETRY SCREEN */}
        {testResult && testResult.submitted ? (
          <div className="space-y-6 text-center py-4 animate-in fade-in">
            {testResult.passed ? (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs uppercase tracking-wider">
                    Test Passed Successfully!
                  </span>
                  <h3 className="text-3xl font-black text-slate-900">
                    Outstanding English Mastery!
                  </h3>
                  <p className="text-base text-slate-700 max-w-lg mx-auto">
                    You scored <strong className="text-emerald-700 font-black">{testResult.scorePercentage}%</strong> and successfully completed the speaking challenge!
                  </p>
                </div>

                {/* Badge Reveal Card */}
                <div className="bg-linear-to-b from-amber-50 to-yellow-100 border-4 border-amber-300 rounded-3xl p-6 max-w-md mx-auto shadow-lg space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                    🏆 New Achievement Badge Unlocked!
                  </span>
                  <div className="flex justify-center py-2">
                    <BadgeGraphic badge={test.badge} isUnlocked={true} size="lg" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black text-amber-950">{test.badge.name}</h4>
                    <p className="text-xs text-amber-900">{test.badge.description}</p>
                  </div>

                  {testResult.coinsAwarded > 0 && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-amber-950 font-black text-sm border border-amber-300 shadow-xs">
                      <Coins className="w-4 h-4 text-amber-600" />
                      <span>+{testResult.coinsAwarded} English Coins Earned!</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base shadow-md focus:ring-4 focus:ring-blue-300"
                  >
                    Continue to Dashboard
                  </button>
                  <button
                    onClick={handleRetry}
                    className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Practice Test Again</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-md">
                  <AlertCircle className="w-12 h-12" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-black text-xs uppercase tracking-wider">
                    Supportive Score: {testResult.scorePercentage}% (Target: 60%)
                  </span>
                  <h3 className="text-3xl font-black text-slate-900">
                    Good Effort! Keep Practicing
                  </h3>
                  <p className="text-base text-slate-700 max-w-lg mx-auto">
                    {testResult.message} You have unlimited retries without penalties.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs text-slate-700">
                  <span className="font-black text-slate-900 block">Helpful Checklist:</span>
                  <p>• Make sure to listen to each audio prompt carefully.</p>
                  <p>• Record your speaking answer in Question 5.</p>
                  <p>• Review the topic lesson items and dialogue if needed.</p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={handleRetry}
                    className="py-3.5 px-6 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-base flex items-center gap-2 shadow-md focus:ring-4 focus:ring-blue-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry Test Now (Free)</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-base"
                  >
                    Review Lesson First
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ACTIVE TEST QUESTIONS */
          <div className="space-y-8">
            {/* PART 1: 2 LISTENING QUESTIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-black text-xs">
                  Part 1
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Listening Comprehension (2 Questions)
                </h3>
              </div>

              {listeningQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
                      Question {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(`${q.audioPrompt}. Question: ${q.question}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs"
                      aria-label={`Play audio for listening question ${idx + 1}`}
                    >
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span>Play Question Audio</span>
                    </button>
                  </div>

                  {/* Audio Prompt Card */}
                  {q.audioPrompt && (
                    <div className="p-4 rounded-xl bg-white border border-blue-200 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Play className="w-5 h-5 text-blue-700 shrink-0" />
                        <span className="text-xs md:text-sm font-semibold text-slate-800">
                          &quot;{q.audioPrompt}&quot;
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(q.audioPrompt || '')}
                        className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-bold text-xs shrink-0"
                        aria-label="Replay audio prompt"
                      >
                        Replay
                      </button>
                    </div>
                  )}

                  <p className="font-black text-sm md:text-base text-slate-900">
                    {q.question}
                  </p>

                  {/* Multiple Choice Options */}
                  <div className="space-y-2" role="radiogroup" aria-label={q.question}>
                    {q.options?.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectOption(q.id, opt.id, opt.text)}
                          className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all focus:ring-4 focus:ring-blue-300 ${
                            isSelected
                              ? 'border-blue-700 bg-blue-50 text-blue-950 font-black shadow-xs'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 font-bold text-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-400 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakText(opt.text);
                            }}
                            className="p-1 text-slate-400 hover:text-blue-700"
                            aria-label={`Listen to option: ${opt.text}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* PART 2: 2 VOCABULARY & SENTENCE QUESTIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-black text-xs">
                  Part 2
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  Vocabulary and Sentence Structure (2 Questions)
                </h3>
              </div>

              {vocabAndSentenceQuestions.map((q, idx) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-black text-teal-700 uppercase tracking-wider">
                      Question {idx + 3} ({q.type === 'vocabulary' ? 'Vocabulary' : 'Sentence Building'})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleSpeakText(q.question)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs"
                      aria-label={`Read Question ${idx + 3} aloud`}
                    >
                      <Volume2 className="w-4 h-4 text-teal-600" />
                      <span>Read Question Aloud</span>
                    </button>
                  </div>

                  <p className="font-black text-sm md:text-base text-slate-900">
                    {q.question}
                  </p>

                  <div className="space-y-2" role="radiogroup" aria-label={q.question}>
                    {q.options?.map((opt) => {
                      const isSelected = selectedAnswers[q.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectOption(q.id, opt.id, opt.text)}
                          className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all focus:ring-4 focus:ring-teal-300 ${
                            isSelected
                              ? 'border-teal-700 bg-teal-50 text-teal-950 font-black shadow-xs'
                              : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 font-bold text-sm'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-400 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeakText(opt.text);
                            }}
                            className="p-1 text-slate-400 hover:text-teal-700"
                            aria-label={`Listen to option: ${opt.text}`}
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* PART 3: 1 SHORT SPEAKING CHALLENGE */}
            {speakingQuestion && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-xs">
                    Part 3
                  </span>
                  <h3 className="text-lg font-black text-slate-900">
                    Short Spoken Speaking Challenge (Participation counts!)
                  </h3>
                </div>

                <div className="p-6 rounded-3xl bg-linear-to-br from-rose-50 to-pink-50 border-2 border-rose-200 space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs font-black uppercase tracking-wider text-rose-800">
                      Question 5: Speaking Prompt
                    </span>
                    <p className="text-base md:text-lg font-black text-slate-900">
                      {speakingQuestion.question}
                    </p>
                    <p className="text-xs text-slate-600">
                      {speakingQuestion.teacherTip}
                    </p>
                  </div>

                  {speakingQuestion.sampleAnswer && (
                    <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs text-slate-700 flex items-center justify-between gap-2">
                      <span><strong>Sample Answer:</strong> &quot;{speakingQuestion.sampleAnswer}&quot;</span>
                      <button
                        type="button"
                        onClick={() => handleSpeakText(speakingQuestion.sampleAnswer || '')}
                        className="px-2 py-1 rounded-md bg-rose-100 text-rose-900 font-bold hover:bg-rose-200 shrink-0"
                        aria-label="Listen to model speaking answer"
                      >
                        Hear Model
                      </button>
                    </div>
                  )}

                  {/* Tactile Microphone Recorder */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg focus:ring-4 focus:ring-rose-300 transition-all active:scale-95"
                        aria-label="Start recording your speaking answer"
                      >
                        <Mic className="w-5 h-5" />
                        <span>{recordedResult ? 'Record Again' : 'Record Speaking Answer'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopRecording}
                        className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-base flex items-center justify-center gap-2.5 shadow-md focus:ring-4 focus:ring-slate-400 animate-pulse active:scale-95"
                        aria-label="Stop recording speaking answer"
                      >
                        <Square className="w-5 h-5 text-rose-400" />
                        <span>Stop Recording</span>
                      </button>
                    )}

                    {recordedResult && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlayPreview}
                          className="px-4 py-3 rounded-2xl bg-white border-2 border-slate-300 hover:bg-slate-50 text-slate-900 font-bold text-sm flex items-center gap-2 shadow-xs"
                          aria-label={isPlayingPreview ? 'Pause audio preview' : 'Play back your recorded speaking'}
                        >
                          {isPlayingPreview ? <Pause className="w-4 h-4 text-rose-600" /> : <Play className="w-4 h-4 text-rose-600" />}
                          <span>{isPlayingPreview ? 'Pause Preview' : 'Play My Recording'}</span>
                        </button>
                        <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Recorded ({recordedResult.durationSeconds}s)</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500">
                Answered: {Object.keys(selectedAnswers).length} of 4 objective questions • Speaking: {recordedResult ? '✓ Ready' : 'Pending'}
              </span>

              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-emerald-300 disabled:opacity-50 transition-all active:scale-95"
                aria-label="Submit test for scoring and badge evaluation"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Grading Test...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Test & Earn Badges</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
