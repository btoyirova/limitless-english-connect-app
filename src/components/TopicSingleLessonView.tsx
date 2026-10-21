import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Volume2,
  Square,
  Repeat,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  Coins,
  BookOpen,
  MessageSquare,
  Layers,
  ArrowRight,
  Check,
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { ConversationTopic, LessonSection, User } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { avatarService } from '../services/avatarService';

interface TopicSingleLessonViewProps {
  topic: ConversationTopic;
  lesson: LessonSection;
  lessonIndex: number;
  totalLessons: number;
  prevLesson: LessonSection | null;
  nextLesson: LessonSection | null;
  isCompleted: boolean;
  onLessonCompleted: (lessonId: string, coinsEarned: number) => void;
  onBackToMenu: () => void;
  onSelectLesson: (lessonId: string) => void;
  currentUser: User;
}

export const TopicSingleLessonView: React.FC<TopicSingleLessonViewProps> = ({
  topic,
  lesson,
  lessonIndex,
  totalLessons,
  prevLesson,
  nextLesson,
  isCompleted,
  onLessonCompleted,
  onBackToMenu,
  onSelectLesson,
  currentUser
}) => {
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const [selectedSubstitutions, setSelectedSubstitutions] = useState<Record<number, { en: string; uz: string }>>({});

  // Practice Knowledge Check States
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);
  const [localCompleted, setLocalCompleted] = useState(isCompleted);

  // Language display toggle: hide written Uzbek translations in English-Only mode
  const showUzbek = currentUser?.displayLanguageMode !== 'en-only';

  // Sync completion state
  useEffect(() => {
    setLocalCompleted(isCompleted);
  }, [isCompleted, lesson.id]);

  // Subscribe to speech state for Toggle Play / Stop
  useEffect(() => {
    const unsub = speechService.subscribe((isSpeaking, _, currentId) => {
      setActiveAudioId(isSpeaking ? currentId : null);
    });
    return () => unsub();
  }, []);

  // Centralized cleanup on lesson change or unmount
  useEffect(() => {
    speechService.stop();
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCompletionMessage(null);
  }, [lesson.id]);

  // Play or Stop audio toggle helper (English audio only, immediate stop on second press)
  const handleToggleAudio = (id: string, text: string) => {
    soundEffects.playClick();
    speechService.toggleSpeak(id, text);
  };

  // Generate objective practice questions tailored to the lesson type
  const lessonQuestions = useMemo(() => {
    const questions: Array<{
      prompt: string;
      correctIndex: number;
      options: string[];
      explanation?: string;
    }> = [];

    // 1. Vocabulary Lesson
    if (lesson.vocabulary && lesson.vocabulary.length >= 2) {
      const list = lesson.vocabulary;
      // Q1: English word -> Uzbek meaning
      const w1 = list[0];
      const distractors1 = list.slice(1, 4).map((w) => w.uzbek);
      const opts1 = Array.from(new Set([w1.uzbek, ...distractors1])).sort(() => 0.5 - Math.random());
      questions.push({
        prompt: `What is the Uzbek translation of "${w1.english}"?`,
        correctIndex: opts1.indexOf(w1.uzbek),
        options: opts1,
        explanation: `"${w1.english}" means "${w1.uzbek}".`,
      });

      // Q2: Uzbek meaning -> English word
      if (list.length >= 2) {
        const w2 = list[1];
        const distractors2 = list.filter((_, idx) => idx !== 1).slice(0, 3).map((w) => w.english);
        const opts2 = Array.from(new Set([w2.english, ...distractors2])).sort(() => 0.5 - Math.random());
        questions.push({
          prompt: `Which English word corresponds to "${w2.uzbek}"?`,
          correctIndex: opts2.indexOf(w2.english),
          options: opts2,
          explanation: `"${w2.uzbek}" is "${w2.english}" in English.`,
        });
      }

      // Q3: Fill in or recognition
      if (list.length >= 3) {
        const w3 = list[2];
        const distractors3 = list.filter((_, idx) => idx !== 2).slice(0, 3).map((w) => w.uzbek);
        const opts3 = Array.from(new Set([w3.uzbek, ...distractors3])).sort(() => 0.5 - Math.random());
        questions.push({
          prompt: `Select the correct translation for "${w3.english}":`,
          correctIndex: opts3.indexOf(w3.uzbek),
          options: opts3,
          explanation: `"${w3.english}" translates to "${w3.uzbek}".`,
        });
      }
    }
    // 2. Sentence Pattern Lesson
    else if (lesson.sentences && lesson.sentences.length > 0) {
      const s1 = lesson.sentences[0];
      const opts1 = [
        s1.english,
        `I do not like this today.`,
        `We are practicing English.`,
      ].sort(() => 0.5 - Math.random());

      questions.push({
        prompt: `Which English sentence expresses: "${s1.uzbek}"?`,
        correctIndex: opts1.indexOf(s1.english),
        options: opts1,
        explanation: `"${s1.uzbek}" is written: "${s1.english}".`,
      });

      if (lesson.sentences.length >= 2) {
        const s2 = lesson.sentences[1];
        const sub = s2.substitutions?.options[0];
        const correctWord = sub?.en || 'food';
        const opts2 = [correctWord, 'never', 'tomorrow'].sort(() => 0.5 - Math.random());

        questions.push({
          prompt: `Which word fits into the sentence: "${s2.english.replace(new RegExp(correctWord, 'i'), '_____')}"?`,
          correctIndex: opts2.indexOf(correctWord),
          options: opts2,
          explanation: `"${correctWord}" fits naturally into this sentence pattern.`,
        });
      }
    }
    // 3. Dialogue / Listening / Conversation Lesson
    else if (lesson.dialogue && lesson.dialogue.length >= 2) {
      const d1 = lesson.dialogue[0];
      const d2 = lesson.dialogue[1];

      const opts1 = [
        `"${d1.text}"`,
        `"Goodbye, see you tomorrow!"`,
        `"I cannot hear you clearly."`,
      ].sort(() => 0.5 - Math.random());

      questions.push({
        prompt: `In the conversation, what does ${d1.speaker} say?`,
        correctIndex: opts1.indexOf(`"${d1.text}"`),
        options: opts1,
        explanation: `${d1.speaker} says: "${d1.text}".`,
      });

      const opts2 = [
        `"${d2.text}"`,
        `"No thank you, I am full."`,
        `"Can we speak tomorrow?"`,
      ].sort(() => 0.5 - Math.random());

      questions.push({
        prompt: `How does ${d2.speaker} respond to ${d1.speaker}?`,
        correctIndex: opts2.indexOf(`"${d2.text}"`),
        options: opts2,
        explanation: `${d2.speaker} responds: "${d2.text}".`,
      });
    }
    // 4. Items / Expressions Lesson
    else if (lesson.items && lesson.items.length > 0) {
      const i1 = lesson.items[0];
      const [en1, uz1] = i1.split('—').map((s) => s.trim());
      const otherEn = lesson.items.slice(1, 4).map((i) => i.split('—')[0].trim());
      const opts1 = Array.from(new Set([en1, ...otherEn])).sort(() => 0.5 - Math.random());

      questions.push({
        prompt: `Which English phrase translates to "${uz1 || en1}"?`,
        correctIndex: opts1.indexOf(en1),
        options: opts1,
        explanation: `"${uz1 || en1}" translates to "${en1}".`,
      });

      if (lesson.items.length >= 2) {
        const i2 = lesson.items[1];
        const [en2, uz2] = i2.split('—').map((s) => s.trim());
        const otherUz = lesson.items
          .filter((_, idx) => idx !== 1)
          .slice(0, 3)
          .map((i) => (i.split('—')[1] || i.split('—')[0]).trim());
        const opts2 = Array.from(new Set([uz2 || en2, ...otherUz])).sort(() => 0.5 - Math.random());

        questions.push({
          prompt: `What is the meaning of "${en2}"?`,
          correctIndex: opts2.indexOf(uz2 || en2),
          options: opts2,
          explanation: `"${en2}" translates to "${uz2 || en2}".`,
        });
      }
    }

    return questions;
  }, [lesson]);

  // Handle Practice Quiz submission & automatic verification
  const handleSubmitPracticeCheck = async () => {
    if (lessonQuestions.length === 0) return;
    soundEffects.playClick();

    let correctCount = 0;
    lessonQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    setQuizSubmitted(true);
    setQuizScore(correctCount);

    const percentage = correctCount / lessonQuestions.length;
    const passed = percentage >= 0.6; // At least 60%

    if (passed) {
      setIsVerifying(true);
      try {
        const result = await avatarService.verifyAndCompleteLesson(
          currentUser.id,
          topic.id,
          lesson.id,
          lesson.category || 'vocabulary',
          {
            quizScore: correctCount,
            quizTotal: lessonQuestions.length,
            category: lesson.category,
            comprehensionPassed: true,
          }
        );

        setLocalCompleted(true);
        setCompletionMessage(result.message);
        onLessonCompleted(lesson.id, result.coinsAwarded);

        if (result.coinsAwarded > 0) {
          soundEffects.playSuccess();
        }
      } catch (err) {
        console.error('Lesson verification failed:', err);
      } finally {
        setIsVerifying(false);
      }
    } else {
      soundEffects.playWarning();
      setCompletionMessage(
        `Score: ${correctCount}/${lessonQuestions.length} (${Math.round(
          percentage * 100
        )}%). You need at least 60% to complete this lesson. Unlimited practice attempts are allowed — review the materials above and try again!`
      );
    }
  };

  const handleResetQuiz = () => {
    soundEffects.playClick();
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setCompletionMessage(null);
    speechService.announce('Practice check reset. Try answering the questions again.');
  };

  // Helper to read entire lesson introduction in natural English with toggle
  const lessonHeaderId = `lesson-hero-${lesson.id}`;
  const isHeaderPlaying = activeAudioId === lessonHeaderId;

  const handleToggleLessonHeaderSpeech = () => {
    const textToSpeak = `${lesson.title}. ${lesson.description || ''}. English learning practice.`;
    handleToggleAudio(lessonHeaderId, textToSpeak);
  };

  return (
    <div className="space-y-8 animate-in fade-in pb-12" role="region" aria-label={`Lesson: ${lesson.title}`}>
      {/* Top Accessible Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              speechService.stop();
              soundEffects.playClick();
              onBackToMenu();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs md:text-sm flex items-center gap-2 focus:ring-4 focus:ring-slate-300 transition-colors cursor-pointer"
            aria-label={`Return to ${topic.title} lessons menu`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Topic Menu</span>
          </button>

          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {topic.title} • Lesson {lessonIndex + 1} of {totalLessons}
            </span>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight" lang="en">
              {lesson.title}
            </h1>
          </div>
        </div>

        {/* Previous / Next Lesson Quick Switches */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {prevLesson && (
            <button
              onClick={() => {
                speechService.stop();
                soundEffects.playClick();
                onSelectLesson(prevLesson.id);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label={`Previous lesson: ${prevLesson.title}`}
            >
              <span>← Prev</span>
            </button>
          )}

          {nextLesson && (
            <button
              onClick={() => {
                speechService.stop();
                soundEffects.playClick();
                onSelectLesson(nextLesson.id);
              }}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-black flex items-center gap-1 shadow-xs focus:ring-2 focus:ring-blue-400 cursor-pointer"
              aria-label={`Next lesson: ${nextLesson.title}`}
            >
              <span>Next →</span>
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header Banner */}
      <section
        className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-6 md:p-8 border-4 border-blue-700 shadow-xl space-y-4"
        aria-labelledby="lesson-hero-title"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-blue-800 text-blue-200 text-xs font-black uppercase tracking-wider">
                Lesson {lessonIndex + 1} of {totalLessons}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-700 text-white text-xs font-bold capitalize">
                {lesson.category || 'Core Vocabulary'}
              </span>
              {localCompleted ? (
                <span className="px-3 py-1 rounded-full bg-emerald-500 text-emerald-950 text-xs font-black flex items-center gap-1 shadow-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Completed (+20 Coins)</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Pass Quiz to Earn 20 Coins</span>
                </span>
              )}
            </div>

            <h2 id="lesson-hero-title" className="text-3xl md:text-4xl font-black tracking-tight" lang="en">
              {lesson.title}
            </h2>

            {showUzbek && lesson.titleUz && (
              <p className="text-xl font-bold text-amber-300" lang="uz">
                {lesson.titleUz}
              </p>
            )}

            {lesson.description && (
              <p className="text-base text-blue-100 font-medium leading-relaxed" lang="en">
                {lesson.description}
              </p>
            )}

            {showUzbek && lesson.descriptionUz && (
              <p className="text-xs md:text-sm text-teal-200 font-medium leading-relaxed" lang="uz">
                {lesson.descriptionUz}
              </p>
            )}
          </div>

          {/* Natural English Audio Guidance Toggle */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleToggleLessonHeaderSpeech}
              className={`px-5 py-3 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-md focus:ring-4 active:scale-95 transition-all cursor-pointer ${
                isHeaderPlaying
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-300'
                  : 'bg-amber-400 hover:bg-amber-300 text-amber-950 focus:ring-amber-200'
              }`}
              aria-label={
                isHeaderPlaying
                  ? `Stop listening to introduction for ${lesson.title}`
                  : `Listen to introduction for ${lesson.title} in English`
              }
            >
              {isHeaderPlaying ? (
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

      {/* Completion feedback banner if available */}
      {completionMessage && (
        <div
          className={`p-5 rounded-3xl border-2 flex items-start gap-4 animate-in fade-in ${
            localCompleted
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-sm'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
          role="alert"
          aria-live="polite"
        >
          {localCompleted ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h3 className="text-base font-black">
              {localCompleted ? 'Congratulations!' : 'Keep Practicing!'}
            </h3>
            <p className="text-sm font-semibold">{completionMessage}</p>
          </div>
        </div>
      )}

      {/* 1. VOCABULARY SECTION */}
      {lesson.vocabulary && lesson.vocabulary.length > 0 && (
        <section
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
          aria-labelledby="lesson-vocab-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-blue-700" />
                <h2 id="lesson-vocab-heading" className="text-2xl font-black text-slate-900">
                  Vocabulary Words ({lesson.vocabulary.length} Words)
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Study each English — Uzbek word pair. Tap Listen to hear natural English pronunciation.
              </p>
            </div>

            {/* Read entire vocabulary list toggle */}
            <button
              onClick={() => {
                const vocabAllId = `vocab-all-${lesson.id}`;
                const allWords = lesson.vocabulary!
                  .map((v) => `${v.english}, ${v.phonetic || ''}`)
                  .join('. ');
                handleToggleAudio(vocabAllId, `Lesson vocabulary words: ${allWords}`);
              }}
              className={`text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer transition-all ${
                activeAudioId === `vocab-all-${lesson.id}`
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
              }`}
              aria-label={
                activeAudioId === `vocab-all-${lesson.id}`
                  ? 'Stop reading vocabulary words'
                  : 'Listen to all vocabulary words aloud in English'
              }
            >
              {activeAudioId === `vocab-all-${lesson.id}` ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Reading All</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Read All Words Aloud</span>
                </>
              )}
            </button>
          </div>

          {/* Vocabulary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Vocabulary words">
            {lesson.vocabulary.map((vocab, vIdx) => {
              const wordAudioId = `word-${lesson.id}-${vIdx}`;
              const isWordPlaying = activeAudioId === wordAudioId;

              const sentenceAudioId = `sentence-${lesson.id}-${vIdx}`;
              const isSentencePlaying = activeAudioId === sentenceAudioId;

              return (
                <div
                  key={vIdx}
                  className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between space-y-3"
                  role="listitem"
                >
                  <div className="space-y-2">
                    {/* English — Uzbek Pair Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {/* Word Pair Display */}
                        <div className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex flex-wrap items-baseline gap-2">
                          <span lang="en" className="text-blue-900">
                            {vocab.english}
                          </span>
                          {showUzbek && (
                            <>
                              <span className="text-slate-400 font-normal">—</span>
                              <span lang="uz" className="text-emerald-800 font-bold">
                                {vocab.uzbek}
                              </span>
                            </>
                          )}
                        </div>

                        {vocab.phonetic && (
                          <span className="text-xs font-mono font-bold text-slate-500 block mt-0.5">
                            {vocab.phonetic}
                          </span>
                        )}
                      </div>

                      {/* Listen / Stop Audio Toggle Button (English only) */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleToggleAudio(wordAudioId, vocab.english)}
                          className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                            isWordPlaying
                              ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-300'
                              : 'bg-white border-2 border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-4 focus:ring-blue-300'
                          }`}
                          aria-label={
                            isWordPlaying
                              ? `Stop speaking ${vocab.english}`
                              : `Listen to ${vocab.english} in English`
                          }
                          title={isWordPlaying ? 'Stop' : 'Listen in English'}
                        >
                          {isWordPlaying ? (
                            <>
                              <Square className="w-4 h-4 fill-white" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-4 h-4" />
                              <span>Listen</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            const repeatId = `repeat-${wordAudioId}`;
                            handleToggleAudio(repeatId, vocab.english);
                          }}
                          className="p-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 focus:ring-4 focus:ring-slate-300 transition-colors cursor-pointer"
                          aria-label={`Repeat ${vocab.english}`}
                          title="Repeat slowly"
                        >
                          <Repeat className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {vocab.audioHint && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{vocab.audioHint}</span>
                      </div>
                    )}

                    {vocab.exampleSentence && (
                      <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Example Sentence:
                          </span>
                          <button
                            onClick={() => handleToggleAudio(sentenceAudioId, vocab.exampleSentence!)}
                            className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer transition-colors ${
                              isSentencePlaying
                                ? 'bg-rose-600 text-white'
                                : 'text-blue-700 hover:bg-blue-50'
                            }`}
                            aria-label={
                              isSentencePlaying
                                ? `Stop example sentence for ${vocab.english}`
                                : `Listen to example: ${vocab.exampleSentence}`
                            }
                          >
                            {isSentencePlaying ? <Square className="w-3.5 h-3.5 fill-white" /> : <Volume2 className="w-3.5 h-3.5" />}
                            <span>{isSentencePlaying ? 'Stop' : 'Listen'}</span>
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-slate-900" lang="en">
                          "{vocab.exampleSentence}"
                        </p>
                        {showUzbek && vocab.exampleSentenceUz && (
                          <p className="text-xs font-medium text-emerald-800" lang="uz">
                            "{vocab.exampleSentenceUz}"
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 2. SENTENCE PATTERNS & SUBSTITUTIONS SECTION */}
      {lesson.sentences && lesson.sentences.length > 0 && (
        <section
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
          aria-labelledby="sentence-patterns-heading"
        >
          <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
            <Sparkles className="w-6 h-6 text-purple-700" />
            <div>
              <h2 id="sentence-patterns-heading" className="text-2xl font-black text-slate-900">
                Sentence Patterns & Practice
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Tap words below to practice substitutions. Build confidence forming full English sentences.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {lesson.sentences.map((sentenceItem, sIdx) => {
              const activeSub = selectedSubstitutions[sIdx] || sentenceItem.substitutions?.options[0];
              const slotName = sentenceItem.substitutions?.slotName || 'Item';

              let renderedEnglish = sentenceItem.english;
              let renderedUzbek = sentenceItem.uzbek;
              if (activeSub && sentenceItem.substitutions) {
                const firstOpt = sentenceItem.substitutions.options[0];
                if (firstOpt && sentenceItem.english.toLowerCase().includes(firstOpt.en.toLowerCase())) {
                  renderedEnglish = sentenceItem.english.replace(new RegExp(firstOpt.en, 'i'), activeSub.en);
                }
              }

              const sentenceAudioId = `pattern-${lesson.id}-${sIdx}`;
              const isPlaying = activeAudioId === sentenceAudioId;

              return (
                <div
                  key={sIdx}
                  className="p-5 rounded-2xl bg-purple-50/50 border-2 border-purple-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black uppercase text-purple-900 tracking-wider">
                        Pattern {sIdx + 1}:
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-1" lang="en">
                        "{renderedEnglish}"
                      </h3>
                      {showUzbek && (
                        <p className="text-sm md:text-base font-bold text-teal-800 mt-0.5" lang="uz">
                          "{activeSub ? `${renderedUzbek} (${activeSub.uz})` : sentenceItem.uzbek}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleAudio(sentenceAudioId, renderedEnglish)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer transition-all ${
                        isPlaying
                          ? 'bg-rose-600 text-white ring-4 ring-rose-200'
                          : 'bg-purple-700 hover:bg-purple-800 text-white focus:ring-4 focus:ring-purple-400'
                      }`}
                      aria-label={isPlaying ? 'Stop sentence audio' : `Listen to sentence: ${renderedEnglish}`}
                    >
                      {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isPlaying ? 'Stop Audio' : 'Listen in English'}</span>
                    </button>
                  </div>

                  {sentenceItem.substitutions && (
                    <div className="space-y-2 pt-2 border-t border-purple-200">
                      <span className="text-xs font-black uppercase text-purple-900 block">
                        Tap a {slotName} to customize your sentence:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {sentenceItem.substitutions.options.map((opt, oIdx) => {
                          const isSelected = activeSub?.en === opt.en;
                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                soundEffects.playClick();
                                setSelectedSubstitutions((prev) => ({ ...prev, [sIdx]: opt }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all border-2 cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-700 text-white border-purple-800 shadow-sm'
                                  : 'bg-white text-purple-900 border-purple-300 hover:bg-purple-100'
                              }`}
                              aria-label={`Substitute with ${opt.en} (${opt.uz})`}
                            >
                              <span>{opt.en}</span>
                              {showUzbek && <span className="opacity-80 ml-1 text-[10px]">({opt.uz})</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. ITEMS / EXPRESSIONS LIST */}
      {lesson.items && lesson.items.length > 0 && (!lesson.vocabulary || lesson.vocabulary.length === 0) && (
        <section
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
          aria-labelledby="items-heading"
        >
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="w-6 h-6 text-blue-700" />
              <h2 id="items-heading" className="text-2xl font-black text-slate-900">
                Expressions & Phrases ({lesson.items.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              English — Uzbek Pairs
            </span>
          </div>

          <ul className="space-y-3" role="list">
            {lesson.items.map((item, iIdx) => {
              const itemId = `item-${lesson.id}-${iIdx}`;
              const isPlaying = activeAudioId === itemId;

              // Parse English part before "—" if present
              const [enPart, uzPart] = item.split('—').map((s) => s.trim());

              return (
                <li
                  key={iIdx}
                  className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex items-center justify-between gap-3 text-base md:text-lg font-bold text-slate-900 hover:border-blue-400 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span lang="en" className="text-blue-950 font-black">
                      {enPart || item}
                    </span>
                    {showUzbek && uzPart && (
                      <span lang="uz" className="block text-sm font-semibold text-emerald-800">
                        — {uzPart}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleAudio(itemId, enPart || item)}
                      className={`p-2 rounded-xl border font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                        isPlaying
                          ? 'bg-rose-600 text-white ring-2 ring-rose-300'
                          : 'bg-white border-slate-200 text-blue-700 hover:bg-blue-50'
                      }`}
                      aria-label={isPlaying ? `Stop: ${enPart || item}` : `Listen to: ${enPart || item}`}
                      title={isPlaying ? 'Stop' : 'Listen'}
                    >
                      {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4" />}
                      <span>{isPlaying ? 'Stop' : 'Listen'}</span>
                    </button>
                    <button
                      onClick={() => handleToggleAudio(`repeat-${itemId}`, enPart || item)}
                      className="p-2 rounded-xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-100"
                      aria-label={`Repeat: ${enPart || item}`}
                      title="Repeat slowly"
                    >
                      <Repeat className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* 4. CONVERSATION DIALOGUE SECTION */}
      {lesson.dialogue && lesson.dialogue.length > 0 && (
        <section
          className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-6"
          aria-labelledby="lesson-dialogue-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-teal-700" />
              <h2 id="lesson-dialogue-heading" className="text-2xl font-black text-slate-900">
                Conversation Practice
              </h2>
            </div>

            {/* Read full dialogue toggle */}
            <button
              onClick={() => {
                const dialogueId = `dialogue-${lesson.id}`;
                const lines = lesson.dialogue!.map((d) => `${d.speaker}: ${d.text}`).join('. ');
                handleToggleAudio(dialogueId, lines);
              }}
              className={`px-4 py-2 rounded-xl font-extrabold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-all ${
                activeAudioId === `dialogue-${lesson.id}`
                  ? 'bg-rose-600 text-white'
                  : 'bg-teal-700 hover:bg-teal-800 text-white'
              }`}
              aria-label={
                activeAudioId === `dialogue-${lesson.id}`
                  ? 'Stop dialogue audio'
                  : 'Listen to entire conversation in English'
              }
            >
              {activeAudioId === `dialogue-${lesson.id}` ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Stop Conversation</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Listen to Full Conversation</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto py-2">
            {lesson.dialogue.map((line, dIdx) => {
              const isFirstSpeaker = dIdx % 2 === 0;
              const lineAudioId = `dialogue-line-${lesson.id}-${dIdx}`;
              const isPlaying = activeAudioId === lineAudioId;

              return (
                <div
                  key={dIdx}
                  className={`p-4 rounded-2xl border-2 flex items-start justify-between gap-3 ${
                    isFirstSpeaker
                      ? 'bg-blue-50/70 border-blue-200 mr-8'
                      : 'bg-teal-50/70 border-teal-200 ml-8'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span
                      className={`block text-xs font-black uppercase tracking-wider ${
                        isFirstSpeaker ? 'text-blue-800' : 'text-teal-800'
                      }`}
                    >
                      {line.speaker}
                    </span>
                    <p className="text-base md:text-lg font-bold text-slate-900 mt-0.5" lang="en">
                      "{line.text}"
                    </p>
                    {showUzbek && line.textUz && (
                      <p className="text-xs md:text-sm font-semibold text-teal-800 mt-0.5" lang="uz">
                        "{line.textUz}"
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleToggleAudio(lineAudioId, `${line.speaker} says: ${line.text}`)}
                    className={`p-2 rounded-xl border transition-colors shrink-0 ${
                      isPlaying
                        ? 'bg-rose-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:text-blue-700'
                    }`}
                    aria-label={isPlaying ? 'Stop line' : `Listen to ${line.speaker}: "${line.text}"`}
                  >
                    {isPlaying ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. GENUINE PRACTICE KNOWLEDGE & COMPREHENSION CHECK (MANDATORY FOR LESSON COMPLETION) */}
      {lessonQuestions.length > 0 && (
        <section
          className="bg-white rounded-3xl p-6 md:p-8 border-4 border-blue-600 shadow-xl space-y-6"
          aria-labelledby="practice-quiz-heading"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-blue-700" />
                <h2 id="practice-quiz-heading" className="text-2xl font-black text-slate-900">
                  Knowledge & Comprehension Check
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                Answer all {lessonQuestions.length} practice questions. Score at least 60% to automatically earn{' '}
                <strong className="text-amber-600">20 English Coins</strong> and complete this lesson.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-black text-xs">
                {lessonQuestions.length} Questions
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs">
                Pass mark: 60%
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {lessonQuestions.map((q, qIdx) => (
              <fieldset
                key={qIdx}
                className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3"
              >
                <legend className="text-base font-bold text-slate-900 px-1">
                  Question {qIdx + 1}: {q.prompt}
                </legend>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isChosen = quizAnswers[qIdx] === oIdx;
                    const isCorrectAnswer = q.correctIndex === oIdx;
                    const showCorrectness = quizSubmitted;

                    let cardStyle = 'bg-white border-slate-300 text-slate-800 hover:border-blue-400';
                    if (isChosen) {
                      cardStyle = 'bg-blue-700 text-white border-blue-800 shadow-xs';
                    }
                    if (showCorrectness) {
                      if (isCorrectAnswer) {
                        cardStyle = 'bg-emerald-600 text-white border-emerald-700 font-black';
                      } else if (isChosen && !isCorrectAnswer) {
                        cardStyle = 'bg-rose-600 text-white border-rose-700';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          setQuizAnswers((prev) => ({ ...prev, [qIdx]: oIdx }));
                        }}
                        className={`p-3.5 rounded-xl border-2 font-bold text-sm text-left transition-all cursor-pointer flex items-center justify-between ${cardStyle}`}
                        aria-label={`Option ${oIdx + 1}: ${opt}`}
                      >
                        <span>{opt}</span>
                        {isChosen && <Check className="w-4 h-4 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
            <span className="text-xs font-bold text-slate-500">
              {Object.keys(quizAnswers).length} of {lessonQuestions.length} answered
            </span>

            <div className="flex items-center gap-2">
              {quizSubmitted && !localCompleted && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="px-4 py-2.5 rounded-xl border-2 border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSubmitPracticeCheck}
                disabled={isVerifying || Object.keys(quizAnswers).length < lessonQuestions.length}
                className="px-6 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-black text-sm shadow-md focus:ring-4 focus:ring-blue-300 transition-all cursor-pointer"
              >
                {isVerifying ? 'Verifying with Server...' : 'Check Answers & Complete Lesson'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Accessible Navigation Controls */}
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            speechService.stop();
            soundEffects.playClick();
            onBackToMenu();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-sm flex items-center justify-center gap-2 focus:ring-4 focus:ring-slate-300 cursor-pointer"
          aria-label="Return to topic lessons menu"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Lesson Menu</span>
        </button>

        {/* Real Status Indicator */}
        <div className="text-xs font-black text-slate-600 flex items-center gap-2">
          {localCompleted ? (
            <span className="text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Lesson Completed (+20 Coins)</span>
            </span>
          ) : (
            <span className="text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
              Complete the knowledge check above to earn coins
            </span>
          )}
        </div>

        {nextLesson && (
          <button
            onClick={() => {
              speechService.stop();
              soundEffects.playClick();
              onSelectLesson(nextLesson.id);
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md focus:ring-4 focus:ring-blue-400 cursor-pointer"
            aria-label={`Next lesson: ${nextLesson.title}`}
          >
            <span>Next Lesson →</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
