import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Save, 
  UploadCloud, 
  Eye, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  Sparkles, 
  Layers, 
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ConversationTopic, LessonSection, LessonVocabularyItem, LessonSentenceItem, DialogueLine, User } from '../../types';
import { teacherService } from '../../services/teacherService';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { CurriculumPreviewModal } from './CurriculumPreviewModal';

interface CurriculumEditorTabProps {
  currentUser: User;
  onCurriculumUpdated: () => void;
}

export const CurriculumEditorTab: React.FC<CurriculumEditorTabProps> = ({
  currentUser,
  onCurriculumUpdated,
}) => {
  const [topics, setTopics] = useState<ConversationTopic[]>(() => {
    const draft = teacherService.getCurriculumDraft();
    return draft || teacherService.getPublishedCurriculum();
  });
  const [hasDraft, setHasDraft] = useState<boolean>(() => !!teacherService.getCurriculumDraft());
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');
  const [previewLesson, setPreviewLesson] = useState<{ topic: ConversationTopic; lesson: LessonSection } | null>(null);

  // Status banners
  const [saveMessage, setSaveMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const currentTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];
  const currentLesson = currentTopic?.lessons?.find((l) => l.id === selectedLessonId) || currentTopic?.lessons?.[0];

  // Set initial selected lesson when topic changes
  React.useEffect(() => {
    if (currentTopic && (!selectedLessonId || !currentTopic.lessons.some((l) => l.id === selectedLessonId))) {
      setSelectedLessonId(currentTopic.lessons[0]?.id || '');
    }
  }, [selectedTopicId, currentTopic]);

  // Helper to update a topic in local state
  const updateCurrentTopic = (updater: (prev: ConversationTopic) => ConversationTopic) => {
    setTopics((prev) =>
      prev.map((t) => {
        if (t.id === currentTopic.id) {
          return updater(t);
        }
        return t;
      })
    );
  };

  // Helper to update a lesson in local state
  const updateCurrentLesson = (updater: (prev: LessonSection) => LessonSection) => {
    updateCurrentTopic((t) => {
      const updatedLessons = t.lessons.map((l) => {
        if (l.id === currentLesson.id) {
          return updater(l);
        }
        return l;
      });
      return { ...t, lessons: updatedLessons };
    });
  };

  // Save as Draft
  const handleSaveDraft = () => {
    try {
      soundEffects.playClick();
      const res = teacherService.saveDraft(topics, currentUser);
      setHasDraft(true);
      setSaveMessage({ text: res.message });
      speechService.announce('Curriculum draft saved successfully.');
      setTimeout(() => setSaveMessage(null), 6000);
    } catch (err: any) {
      soundEffects.playWarning();
      setSaveMessage({ text: err?.message || 'Failed to save draft.', isError: true });
    }
  };

  // Publish Changes Live
  const handlePublish = () => {
    try {
      soundEffects.playSuccess();
      const res = teacherService.publishCurriculum(topics, currentUser);
      setHasDraft(false);
      setSaveMessage({ text: res.message });
      speechService.announce('Curriculum published live to all students.');
      onCurriculumUpdated();
      setTimeout(() => setSaveMessage(null), 8000);
    } catch (err: any) {
      soundEffects.playWarning();
      setSaveMessage({ text: err?.message || 'Failed to publish.', isError: true });
    }
  };

  // Restore Defaults
  const handleRestoreDefaults = () => {
    if (window.confirm('Are you sure you want to revert all topics and lessons to original default curriculum? Drafts and unsaved edits will be discarded.')) {
      const restored = teacherService.restoreDefaultCurriculum(currentUser);
      setTopics(restored);
      setHasDraft(false);
      soundEffects.playClick();
      setSaveMessage({ text: 'Curriculum restored to original system defaults.' });
      onCurriculumUpdated();
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  // Add new vocabulary word to current lesson
  const handleAddVocabularyWord = () => {
    soundEffects.playClick();
    const newWord: LessonVocabularyItem = {
      english: 'New Word',
      uzbek: 'Yangi so‘z',
      phonetic: '/njuː wɜːrd/',
      exampleSentence: 'This is a new example sentence in English.',
      exampleSentenceUz: 'Bu ingliz tilidagi yangi misol gap.',
      audioHint: 'Listen and repeat.'
    };
    updateCurrentLesson((l) => ({
      ...l,
      vocabulary: [...(l.vocabulary || []), newWord]
    }));
  };

  // Remove vocabulary word
  const handleRemoveVocabularyWord = (index: number) => {
    soundEffects.playClick();
    updateCurrentLesson((l) => ({
      ...l,
      vocabulary: l.vocabulary?.filter((_, idx) => idx !== index)
    }));
  };

  // Add new lesson to current topic
  const handleAddNewLesson = () => {
    soundEffects.playClick();
    const nextNum = (currentTopic.lessons?.length || 0) + 1;
    const newLesson: LessonSection = {
      id: `${currentTopic.id}-l${Date.now().toString(36)}`,
      title: `Lesson ${nextNum}: New Lesson`,
      titleUz: `${nextNum}-dars: Yangi dars`,
      lessonNumber: nextNum,
      category: 'vocabulary',
      description: 'Educational lesson description.',
      descriptionUz: 'Dars tavsifi.',
      items: [],
      vocabulary: [
        {
          english: 'Hello',
          uzbek: 'Salom',
          phonetic: '/həˈloʊ/',
          exampleSentence: 'Hello, welcome to our class!',
          exampleSentenceUz: 'Salom, darsimizga xush kelibsiz!'
        }
      ],
      sentences: [],
      dialogue: []
    };

    updateCurrentTopic((t) => ({
      ...t,
      lessons: [...t.lessons, newLesson]
    }));
    setSelectedLessonId(newLesson.id);
  };

  // Delete current lesson
  const handleDeleteCurrentLesson = () => {
    if (currentTopic.lessons.length <= 1) {
      soundEffects.playWarning();
      speechService.announce('Topics must retain at least one lesson.');
      return;
    }
    soundEffects.playClick();
    updateCurrentTopic((t) => ({
      ...t,
      lessons: t.lessons.filter((l) => l.id !== currentLesson.id)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-700" />
              <h2 className="text-2xl font-black text-slate-900">
                Curriculum & Content Management
              </h2>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1 font-medium">
              Verified teachers can edit vocabulary words, Uzbek translations, grammar, example sentences, dialogue, and quizzes without writing code.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {hasDraft && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black animate-pulse">
                Draft Changes Unsaved
              </span>
            )}

            <button
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-700" />
              <span>Save as Draft</span>
            </button>

            <button
              onClick={() => {
                if (currentTopic && currentLesson) {
                  setPreviewLesson({ topic: currentTopic, lesson: currentLesson });
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center gap-2 border border-indigo-200 cursor-pointer shadow-xs"
            >
              <Eye className="w-4 h-4 text-indigo-700" />
              <span>Preview Lesson as Student</span>
            </button>

            <button
              onClick={handlePublish}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Publish Live to Students</span>
            </button>

            <button
              onClick={handleRestoreDefaults}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              title="Restore system defaults"
              aria-label="Restore system defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {saveMessage && (
          <div
            className={`p-4 rounded-2xl border-2 flex items-center gap-3 text-xs md:text-sm font-semibold animate-in fade-in ${
              saveMessage.isError
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
            role="alert"
          >
            {saveMessage.isError ? (
              <AlertCircle className="w-5 h-5 text-rose-700 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Educational Preservation Guard Note */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5 font-medium">
          <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <span>
            <strong>Student Progress Preservation:</strong> Editing vocabulary spelling or example sentences will preserve students' existing coin records and completed topic achievements. Lesson IDs remain intact.
          </span>
        </div>
      </div>

      {/* Topics Selector & Lesson Navigation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Topics List */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm space-y-3">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider block">
            Select Topic ({topics.length})
          </span>
          <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
            {topics.map((t, idx) => {
              const isSelected = t.id === currentTopic?.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    soundEffects.playClick();
                    setSelectedTopicId(t.id);
                  }}
                  className={`w-full text-left p-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-300'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200'
                  }`}
                >
                  <div className="truncate pr-2">
                    <span className="opacity-75 block text-[10px]">Topic {idx + 1}</span>
                    <span className="truncate block font-black">{t.title}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {t.lessons?.length || 0} lessons
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Lessons of Topic & Detailed Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Topic Metadata Quick Editor */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-blue-700">Topic Overview Settings</span>
                <h3 className="text-xl font-black text-slate-900">{currentTopic.title}</h3>
              </div>
              <button
                onClick={handleAddNewLesson}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Lesson</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-700 block">English Topic Title</label>
                <input
                  type="text"
                  value={currentTopic.title}
                  onChange={(e) => updateCurrentTopic((t) => ({ ...t, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-700 block">Uzbek Title (Latin Script)</label>
                <input
                  type="text"
                  value={currentTopic.titleUz || ''}
                  onChange={(e) => updateCurrentTopic((t) => ({ ...t, titleUz: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border-2 border-slate-300 text-sm font-bold focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-700 block">Learning Objective (English)</label>
                <input
                  type="text"
                  value={currentTopic.learningObjective || ''}
                  onChange={(e) => updateCurrentTopic((t) => ({ ...t, learningObjective: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-slate-700 block">Learning Objective (Uzbek)</label>
                <input
                  type="text"
                  value={currentTopic.learningObjectiveUz || ''}
                  onChange={(e) => updateCurrentTopic((t) => ({ ...t, learningObjectiveUz: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:border-blue-500"
                />
              </div>
            </div>

            {/* Lessons Tabs for this Topic */}
            <div className="pt-2">
              <span className="text-xs font-black uppercase text-slate-500 block mb-2">Lessons in this Topic:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {currentTopic.lessons.map((lesson, lIdx) => {
                  const isSelected = lesson.id === currentLesson?.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedLessonId(lesson.id);
                      }}
                      className={`px-4 py-2 rounded-xl font-black text-xs shrink-0 cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Lesson {lIdx + 1}: {lesson.title.replace(/^Lesson \d+:\s*/i, '')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed Lesson Content Editor */}
          {currentLesson && (
            <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-black uppercase text-purple-700">Editing Individual Lesson</span>
                  <h3 className="text-2xl font-black text-slate-900">{currentLesson.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewLesson({ topic: currentTopic, lesson: currentLesson })}
                    className="px-3 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs flex items-center gap-1 border border-indigo-200"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={handleDeleteCurrentLesson}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200"
                    title="Delete Lesson"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Lesson Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-black uppercase text-slate-700 block">Lesson Title (English)</label>
                  <input
                    type="text"
                    value={currentLesson.title}
                    onChange={(e) => updateCurrentLesson((l) => ({ ...l, title: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-black uppercase text-slate-700 block">Lesson Title (Uzbek)</label>
                  <input
                    type="text"
                    value={currentLesson.titleUz || ''}
                    onChange={(e) => updateCurrentLesson((l) => ({ ...l, titleUz: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-black uppercase text-slate-700 block">Category</label>
                  <select
                    value={currentLesson.category || 'vocabulary'}
                    onChange={(e) => updateCurrentLesson((l) => ({ ...l, category: e.target.value as any }))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                  >
                    <option value="vocabulary">Vocabulary (Words & Phonics)</option>
                    <option value="sentences">Sentences (Patterns & Substitutions)</option>
                    <option value="conversation">Conversation (Dialogue Practice)</option>
                    <option value="practice">Practice (Listening & Speaking)</option>
                  </select>
                </div>
              </div>

              {/* Lesson Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Description (English)</label>
                  <textarea
                    rows={2}
                    value={currentLesson.description || ''}
                    onChange={(e) => updateCurrentLesson((l) => ({ ...l, description: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Description (Uzbek)</label>
                  <textarea
                    rows={2}
                    value={currentLesson.descriptionUz || ''}
                    onChange={(e) => updateCurrentLesson((l) => ({ ...l, descriptionUz: e.target.value }))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                </div>
              </div>

              {/* VOCABULARY WORDS EDITOR */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-700" />
                    <h4 className="text-lg font-black text-slate-900">
                      Vocabulary Items ({currentLesson.vocabulary?.length || 0})
                    </h4>
                  </div>
                  <button
                    onClick={handleAddVocabularyWord}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Word</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(currentLesson.vocabulary || []).map((vocab, vIdx) => (
                    <div
                      key={vIdx}
                      className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-blue-900">
                          Word #{vIdx + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveVocabularyWord(vIdx)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                          title="Delete Word"
                          aria-label={`Delete word ${vocab.english}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-0.5">English Word</label>
                          <input
                            type="text"
                            value={vocab.english}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentLesson((l) => {
                                const newVocab = [...(l.vocabulary || [])];
                                newVocab[vIdx] = { ...newVocab[vIdx], english: val };
                                return { ...l, vocabulary: newVocab };
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-black text-blue-900"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Uzbek Translation</label>
                          <input
                            type="text"
                            value={vocab.uzbek}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentLesson((l) => {
                                const newVocab = [...(l.vocabulary || [])];
                                newVocab[vIdx] = { ...newVocab[vIdx], uzbek: val };
                                return { ...l, vocabulary: newVocab };
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-emerald-800"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Phonetic Spelling</label>
                          <input
                            type="text"
                            value={vocab.phonetic || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentLesson((l) => {
                                const newVocab = [...(l.vocabulary || [])];
                                newVocab[vIdx] = { ...newVocab[vIdx], phonetic: val };
                                return { ...l, vocabulary: newVocab };
                              });
                            }}
                            placeholder="/fəˈnet.ɪk/"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* Example sentences */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Example Sentence (English)</label>
                          <input
                            type="text"
                            value={vocab.exampleSentence || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentLesson((l) => {
                                const newVocab = [...(l.vocabulary || [])];
                                newVocab[vIdx] = { ...newVocab[vIdx], exampleSentence: val };
                                return { ...l, vocabulary: newVocab };
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600 block mb-0.5">Example Sentence (Uzbek)</label>
                          <input
                            type="text"
                            value={vocab.exampleSentenceUz || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateCurrentLesson((l) => {
                                const newVocab = [...(l.vocabulary || [])];
                                newVocab[vIdx] = { ...newVocab[vIdx], exampleSentenceUz: val };
                                return { ...l, vocabulary: newVocab };
                              });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Preview Modal */}
      {previewLesson && (
        <CurriculumPreviewModal
          topic={previewLesson.topic}
          lesson={previewLesson.lesson}
          onClose={() => setPreviewLesson(null)}
        />
      )}
    </div>
  );
};
