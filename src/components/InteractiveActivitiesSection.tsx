import React, { useState } from 'react';
import { 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Send, 
  BookOpen, 
  Coins, 
  Headphones, 
  HelpCircle, 
  Check, 
  Loader2, 
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';
import { ConversationTopic, User } from '../types';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';
import { avatarService } from '../services/avatarService';

interface InteractiveActivitiesSectionProps {
  topic: ConversationTopic;
  currentUser: User;
  onOpenTest: () => void;
  isTestPassed?: boolean;
}

export const InteractiveActivitiesSection: React.FC<InteractiveActivitiesSectionProps> = ({
  topic,
  currentUser,
  onOpenTest,
  isTestPassed = false,
}) => {
  const [activeTab, setActiveTab] = useState<'listen' | 'vocab' | 'sentence' | 'ai-chat' | 'test'>('listen');

  // State for Activity 1: Listen & Choose
  const [selectedLcAnswers, setSelectedLcAnswers] = useState<Record<string, string>>({});
  const [lcFeedback, setLcFeedback] = useState<Record<string, { isCorrect: boolean; explanation: string }>>({});
  const [completedLc, setCompletedLc] = useState<boolean>(false);

  // State for Activity 2: Vocabulary Challenge
  const [learnedVocabWords, setLearnedVocabWords] = useState<Record<string, boolean>>({});
  const [completedVocab, setCompletedVocab] = useState<boolean>(false);

  // State for Activity 3: Build a Sentence
  const [constructedWords, setConstructedWords] = useState<Record<string, string[]>>({});
  const [sentenceChecked, setSentenceChecked] = useState<Record<string, { isCorrect: boolean; message: string }>>({});
  const [completedSentence, setCompletedSentence] = useState<boolean>(false);

  // State for Activity 4: AI Conversation Practice
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>(() => {
    const initialGreeting = topic.aiRoleplayScenario?.initialAIGreeting || `Hello! Welcome to our English practice. What is your name?`;
    return [{ sender: 'ai', text: initialGreeting }];
  });
  const [userInputText, setUserInputText] = useState<string>('');
  const [isAiReplying, setIsAiReplying] = useState<boolean>(false);
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>(
    topic.aiRoleplayScenario?.suggestedStudentStarters || ['Hello!', 'Good morning!', 'My name is...']
  );
  const [completedChat, setCompletedChat] = useState<boolean>(false);

  const handleTabChange = (tab: 'listen' | 'vocab' | 'sentence' | 'ai-chat' | 'test', label: string) => {
    soundEffects.playClick();
    setActiveTab(tab);
    speechService.announce(`Switched to ${label}`);
  };

  // --------------------------------------------------------------------------
  // ACTIVITY 1: LISTEN & CHOOSE HANDLERS
  // --------------------------------------------------------------------------
  const handleSelectLcOption = async (itemId: string, optionId: string, isCorrect: boolean, explanation: string) => {
    soundEffects.playClick();
    setSelectedLcAnswers((prev) => ({ ...prev, [itemId]: optionId }));
    setLcFeedback((prev) => ({
      ...prev,
      [itemId]: { isCorrect, explanation },
    }));

    if (isCorrect) {
      soundEffects.playSuccess();
      speechService.announce(`Correct! ${explanation}`);
    } else {
      soundEffects.playWarning();
      speechService.announce(`Not quite. ${explanation}`);
    }

    // Check if both or all items are correct
    const allItems = topic.listenAndChoose || [];
    const newAnswers = { ...selectedLcAnswers, [itemId]: optionId };
    const allCorrect = allItems.every((item) => {
      const selectedId = newAnswers[item.id];
      const correctOpt = item.options.find((o) => o.isCorrect);
      return correctOpt && selectedId === correctOpt.id;
    });

    if (allCorrect && !completedLc) {
      setCompletedLc(true);
      await avatarService.awardCoins(
        currentUser.id,
        10,
        `activity-lc-${topic.id}`,
        `Completed Listen & Choose in ${topic.title}`
      );
    }
  };

  // --------------------------------------------------------------------------
  // ACTIVITY 2: VOCABULARY CHALLENGE HANDLERS
  // --------------------------------------------------------------------------
  const handleToggleLearnedWord = async (wordId: string, word: string) => {
    soundEffects.playClick();
    const isNowLearned = !learnedVocabWords[wordId];
    setLearnedVocabWords((prev) => ({ ...prev, [wordId]: isNowLearned }));

    if (isNowLearned) {
      speechService.announce(`Word marked as mastered: ${word}`);
    }

    const allVocab = topic.vocabularyChallenge || [];
    const nextLearned = { ...learnedVocabWords, [wordId]: isNowLearned };
    const countLearned = Object.values(nextLearned).filter(Boolean).length;

    if (countLearned === allVocab.length && !completedVocab) {
      setCompletedVocab(true);
      soundEffects.playSuccess();
      await avatarService.awardCoins(
        currentUser.id,
        10,
        `activity-vocab-${topic.id}`,
        `Completed Vocabulary Challenge in ${topic.title}`
      );
    }
  };

  // --------------------------------------------------------------------------
  // ACTIVITY 3: BUILD A SENTENCE HANDLERS
  // --------------------------------------------------------------------------
  const handleAddWordToSentence = (sentenceId: string, word: string) => {
    soundEffects.playClick();
    setConstructedWords((prev) => {
      const current = prev[sentenceId] || [];
      return { ...prev, [sentenceId]: [...current, word] };
    });
    speechService.announce(`Added word: ${word}`);
  };

  const handleResetConstructedSentence = (sentenceId: string) => {
    soundEffects.playClick();
    setConstructedWords((prev) => ({ ...prev, [sentenceId]: [] }));
    setSentenceChecked((prev) => {
      const next = { ...prev };
      delete next[sentenceId];
      return next;
    });
    speechService.announce('Cleared words. Try building your sentence again.');
  };

  const handleCheckSentence = async (sentenceId: string, targetSentence: string, hint: string) => {
    soundEffects.playClick();
    const words = constructedWords[sentenceId] || [];
    const constructed = words.join(' ').trim().toLowerCase().replace(/[.,!?;:]/g, '');
    const cleanTarget = targetSentence.trim().toLowerCase().replace(/[.,!?;:]/g, '');

    const isCorrect = constructed === cleanTarget;

    if (isCorrect) {
      soundEffects.playSuccess();
      setSentenceChecked((prev) => ({
        ...prev,
        [sentenceId]: { isCorrect: true, message: `Excellent! Correct sentence: "${targetSentence}"` },
      }));
      speechService.announce(`Excellent! Correct sentence: "${targetSentence}"`);

      // Check if all sentence builder items are solved
      const allSb = topic.sentenceBuilder || [];
      const newChecked = { ...sentenceChecked, [sentenceId]: { isCorrect: true, message: '' } };
      const allDone = allSb.every((item) => newChecked[item.id]?.isCorrect);
      if (allDone && !completedSentence) {
        setCompletedSentence(true);
        await avatarService.awardCoins(
          currentUser.id,
          10,
          `activity-sb-${topic.id}`,
          `Completed Sentence Builder in ${topic.title}`
        );
      }
    } else {
      soundEffects.playWarning();
      setSentenceChecked((prev) => ({
        ...prev,
        [sentenceId]: { isCorrect: false, message: `Not quite yet. Hint: ${hint}` },
      }));
      speechService.announce(`Not quite yet. Hint: ${hint}. Try resetting and ordering the words again.`);
    }
  };

  // --------------------------------------------------------------------------
  // ACTIVITY 4: AI CONVERSATION PRACTICE HANDLERS
  // --------------------------------------------------------------------------
  const handleSendChatMessage = async (textToSend?: string) => {
    const text = (textToSend || userInputText).trim();
    if (!text || isAiReplying) return;

    soundEffects.playClick();
    setUserInputText('');
    const newHistory = [...chatMessages, { sender: 'user' as const, text }];
    setChatMessages(newHistory);
    setIsAiReplying(true);

    try {
      const res = await fetch('/api/conversation-practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicTitle: topic.title,
          scenarioContext: topic.aiRoleplayScenario?.contextDescription || 'Beginner English Conversation',
          studentMessage: text,
          history: newHistory,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText = data.reply || "Good job! That was clear. Let's keep talking.";
        setChatMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestedReplies(data.suggestions);
        }
        speechService.announce(`AI Partner says: ${replyText}`);
      } else {
        const fallback = "Wonderful effort! Can you tell me more?";
        setChatMessages((prev) => [...prev, { sender: 'ai', text: fallback }]);
        speechService.announce(`AI Partner says: ${fallback}`);
      }
    } catch {
      const fallback = "Great sentence! You are doing very well.";
      setChatMessages((prev) => [...prev, { sender: 'ai', text: fallback }]);
      speechService.announce(`AI Partner says: ${fallback}`);
    } finally {
      setIsAiReplying(false);
    }

    // Award 10 coins once the student has exchanged at least 2 messages
    if (newHistory.filter((m) => m.sender === 'user').length >= 2 && !completedChat) {
      setCompletedChat(true);
      await avatarService.awardCoins(
        currentUser.id,
        10,
        `activity-chat-${topic.id}`,
        `Completed AI Conversation Practice in ${topic.title}`
      );
    }
  };

  return (
    <section 
      className="bg-white rounded-3xl p-6 md:p-8 border-4 border-indigo-500 shadow-xl space-y-6"
      aria-labelledby="activities-suite-heading"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-black mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Interactive Learning Activities Suite</span>
          </div>
          <h2 id="activities-suite-heading" className="text-2xl md:text-3xl font-black text-slate-900">
            Interactive Practice Activities
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Choose any activity to practice. Complete activities to earn English Coins and get ready for the End-of-Topic Test!
          </p>
        </div>

        <button
          onClick={onOpenTest}
          className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-sm flex items-center gap-2 shadow-md focus:ring-4 focus:ring-amber-200 active:scale-95 transition-all shrink-0"
          aria-label={`Take End of Topic Test for ${topic.title} to earn 50 English Coins`}
        >
          <Award className="w-5 h-5 text-amber-900" />
          <span>{isTestPassed ? 'Retake Topic Test' : 'Take Topic Test (+50 Coins)'}</span>
        </button>
      </div>

      {/* Activity Navigation Tabs */}
      <nav 
        className="flex items-center gap-2 overflow-x-auto pb-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200" 
        role="tablist"
        aria-label="Interactive practice activities"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'listen'}
          onClick={() => handleTabChange('listen', 'Activity 1: Listen and Choose')}
          className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all border-2 ${
            activeTab === 'listen'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>1. Listen & Choose {completedLc && '✓'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'vocab'}
          onClick={() => handleTabChange('vocab', 'Activity 2: Vocabulary Challenge')}
          className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all border-2 ${
            activeTab === 'vocab'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Vocabulary {completedVocab && '✓'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'sentence'}
          onClick={() => handleTabChange('sentence', 'Activity 3: Build a Sentence')}
          className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all border-2 ${
            activeTab === 'sentence'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>3. Build Sentence {completedSentence && '✓'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'ai-chat'}
          onClick={() => handleTabChange('ai-chat', 'Activity 4: AI Conversation Practice')}
          className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all border-2 ${
            activeTab === 'ai-chat'
              ? 'bg-blue-700 text-white border-blue-800 shadow-sm'
              : 'bg-white text-slate-700 border-transparent hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>4. AI Conversation {completedChat && '✓'}</span>
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'test'}
          onClick={onOpenTest}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all border-2 bg-amber-400 text-amber-950 border-amber-500 hover:bg-amber-300"
        >
          <Coins className="w-4 h-4 text-amber-900" />
          <span>Topic Test (+50 Coins)</span>
        </button>
      </nav>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: LISTEN & CHOOSE */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'listen' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-blue-950">
                Activity 1: Listen & Choose (Audio Comprehension)
              </h3>
              <p className="text-xs text-blue-900 mt-0.5">
                Press the Listen button to hear the audio passage, then select the best matching answer.
              </p>
            </div>
            {completedLc && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                ✓ 10 Coins Earned
              </span>
            )}
          </div>

          <div className="space-y-6">
            {(topic.listenAndChoose || []).map((item, idx) => {
              const selectedId = selectedLcAnswers[item.id];
              const feedback = lcFeedback[item.id];

              return (
                <div 
                  key={item.id}
                  className="p-5 md:p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs font-black text-blue-800 uppercase tracking-wider">
                      Question {idx + 1} of {(topic.listenAndChoose || []).length}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        speechService.speak(item.audioPrompt, true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 focus:ring-4 focus:ring-blue-300 shadow-xs"
                      aria-label={`Listen to audio prompt for Question ${idx + 1}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Play Spoken Audio Prompt</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <p className="text-sm md:text-base font-extrabold text-slate-900 italic">
                      "{item.audioPrompt}"
                    </p>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 mb-3">
                      {item.question}
                    </h4>

                    <div className="space-y-2.5" role="radiogroup" aria-label={item.question}>
                      {item.options.map((opt) => {
                        const isSelected = selectedId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => handleSelectLcOption(item.id, opt.id, opt.isCorrect, item.explanation)}
                            className={`w-full p-4 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition-all focus:ring-4 focus:ring-blue-300 ${
                              isSelected
                                ? opt.isCorrect
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black'
                                  : 'border-rose-500 bg-rose-50 text-rose-950 font-black'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800 font-bold'
                            }`}
                          >
                            <span className="text-sm md:text-base">{opt.text}</span>
                            {isSelected && (
                              opt.isCorrect 
                                ? <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                                : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {feedback && (
                    <div 
                      className={`p-3.5 rounded-xl border text-xs md:text-sm font-bold flex items-start gap-2 ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-amber-50 border-amber-300 text-amber-950'
                      }`}
                      role="alert"
                    >
                      {feedback.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      )}
                      <span>{feedback.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: VOCABULARY CHALLENGE */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'vocab' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-teal-950">
                Activity 2: Key Vocabulary & Phonetics
              </h3>
              <p className="text-xs text-teal-900 mt-0.5">
                Listen to the clear pronunciation of each word, its phonetic transcription, definition, and example sentence.
              </p>
            </div>
            {completedVocab && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                ✓ 10 Coins Earned
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(topic.vocabularyChallenge || []).map((v) => {
              const isLearned = learnedVocabWords[v.id];

              return (
                <div 
                  key={v.id}
                  className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col justify-between space-y-4 hover:border-teal-400 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-black text-slate-900">
                          {v.word}
                        </h4>
                        <span className="text-xs font-mono font-bold text-teal-800">
                          {v.phonetic}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          soundEffects.playClick();
                          speechService.speak(`${v.word}. ${v.definition}`, true);
                        }}
                        className="p-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white shadow-xs focus:ring-4 focus:ring-teal-300"
                        aria-label={`Listen to pronunciation of ${v.word}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      <strong>Meaning:</strong> {v.definition}
                    </p>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-medium">
                      <strong>Example:</strong> "{v.exampleSentence}"
                    </div>

                    {v.audioHint && (
                      <p className="text-xs text-slate-500 italic">
                        Tip: {v.audioHint}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleLearnedWord(v.id, v.word)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isLearned
                        ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{isLearned ? 'Mastered Word' : 'Mark as Mastered'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: BUILD A SENTENCE */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'sentence' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-indigo-950">
                Activity 3: Build a Sentence (Word Scramble)
              </h3>
              <p className="text-xs text-indigo-900 mt-0.5">
                Click or tap the scrambled words in the correct sequence to build a proper English sentence.
              </p>
            </div>
            {completedSentence && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                ✓ 10 Coins Earned
              </span>
            )}
          </div>

          <div className="space-y-6">
            {(topic.sentenceBuilder || []).map((sb, idx) => {
              const currentSentenceWords = constructedWords[sb.id] || [];
              const checkResult = sentenceChecked[sb.id];

              return (
                <div 
                  key={sb.id}
                  className="p-5 md:p-6 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-indigo-800 tracking-wider">
                      Challenge {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        speechService.speak(sb.instruction, true);
                      }}
                      className="p-1.5 rounded-lg text-indigo-700 hover:bg-indigo-100"
                      aria-label="Listen to instruction"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h4 className="text-base font-black text-slate-900">
                    {sb.instruction}
                  </h4>

                  {/* Words to choose from */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Tap words to add to sentence:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {sb.scrambledWords.map((word, wIdx) => (
                        <button
                          key={wIdx}
                          type="button"
                          onClick={() => handleAddWordToSentence(sb.id, word)}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-indigo-50 border-2 border-indigo-200 text-slate-900 font-extrabold text-sm shadow-xs focus:ring-4 focus:ring-indigo-300 active:scale-95 transition-all"
                          aria-label={`Add word ${word} to sentence`}
                        >
                          + {word}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Constructed Sentence Box */}
                  <div className="p-4 rounded-xl bg-white border-2 border-dashed border-indigo-300 min-h-[60px] flex items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {currentSentenceWords.length > 0 ? (
                        currentSentenceWords.map((w, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1.5 rounded-lg bg-indigo-700 text-white font-extrabold text-sm"
                          >
                            {w}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm font-medium text-slate-400 italic">
                          Words you tap will appear here in order...
                        </span>
                      )}
                    </div>

                    {currentSentenceWords.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleResetConstructedSentence(sb.id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 shrink-0"
                        title="Clear sentence"
                        aria-label="Clear all words from your constructed sentence"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={currentSentenceWords.length === 0}
                      onClick={() => handleCheckSentence(sb.id, sb.targetSentence, sb.hint)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 disabled:opacity-40 text-white font-black text-sm shadow-xs focus:ring-4 focus:ring-indigo-300 cursor-pointer"
                    >
                      Check Sentence
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        soundEffects.playClick();
                        speechService.speak(`Hint: ${sb.hint}`, true);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs"
                      aria-label="Listen to sentence hint"
                    >
                      Listen to Hint
                    </button>
                  </div>

                  {/* Feedback Banner */}
                  {checkResult && (
                    <div 
                      className={`p-3.5 rounded-xl border text-sm font-bold flex items-center gap-2 ${
                        checkResult.isCorrect 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                          : 'bg-rose-50 border-rose-300 text-rose-950'
                      }`}
                      role="alert"
                    >
                      {checkResult.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                      <span>{checkResult.message}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: AI CONVERSATION PRACTICE */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === 'ai-chat' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-purple-950">
                Activity 4: AI English Conversation Practice
              </h3>
              <p className="text-xs text-purple-900 mt-0.5">
                Chat in real time with an encouraging AI tutor. Each response is short, clear, and audio-ready.
              </p>
            </div>
            {completedChat && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-300">
                ✓ 10 Coins Earned
              </span>
            )}
          </div>

          {/* Context box */}
          {topic.aiRoleplayScenario && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
              <strong>Scenario:</strong> {topic.aiRoleplayScenario.scenarioTitle} — {topic.aiRoleplayScenario.contextDescription}
            </div>
          )}

          {/* Message Thread */}
          <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 max-h-80 overflow-y-auto space-y-3" role="log" aria-label="Conversation message thread">
            {chatMessages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-start justify-between gap-3 max-w-[85%] ${
                    isAi 
                      ? 'bg-white border-purple-200 mr-auto text-slate-900' 
                      : 'bg-indigo-700 border-indigo-800 ml-auto text-white'
                  }`}
                >
                  <div>
                    <span className={`block text-[11px] font-black uppercase tracking-wider ${isAi ? 'text-purple-800' : 'text-indigo-200'}`}>
                      {isAi ? 'AI Speaking Partner' : 'You (Student)'}
                    </span>
                    <p className="text-sm md:text-base font-bold mt-0.5">
                      {msg.text}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playClick();
                      speechService.speak(msg.text, true);
                    }}
                    className={`p-1.5 rounded-lg shrink-0 ${isAi ? 'text-purple-700 hover:bg-purple-50' : 'text-indigo-200 hover:bg-indigo-600'}`}
                    aria-label={`Listen to ${isAi ? 'AI partner' : 'your message'}: "${msg.text}"`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {isAiReplying && (
              <div className="p-3.5 rounded-2xl bg-white border border-purple-200 mr-auto flex items-center gap-2 text-xs font-bold text-purple-700 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI partner is listening and thinking of an encouraging response...</span>
              </div>
            )}
          </div>

          {/* Suggested Starter Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Quick Reply Suggestions:
            </span>
            <div className="flex flex-wrap gap-2">
              {suggestedReplies.map((sug, sIdx) => (
                <button
                  key={sIdx}
                  type="button"
                  onClick={() => handleSendChatMessage(sug)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold text-xs focus:ring-2 focus:ring-purple-400 active:scale-95 transition-transform"
                >
                  "{sug}"
                </button>
              ))}
            </div>
          </div>

          {/* Text input to speak or type */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendChatMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
              placeholder="Type your reply here..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-300 text-slate-900 font-bold focus:border-purple-600 focus:ring-4 focus:ring-purple-100 outline-none text-sm"
              aria-label="Type your English reply to the AI partner"
            />
            <button
              type="submit"
              disabled={isAiReplying || !userInputText.trim()}
              className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white font-black text-sm flex items-center gap-1.5 shadow-xs focus:ring-4 focus:ring-purple-300 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </section>
  );
};
