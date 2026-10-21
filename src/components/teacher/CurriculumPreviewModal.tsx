import React from 'react';
import { X, Volume2, Square, Sparkles, BookOpen, Layers, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ConversationTopic, LessonSection } from '../../types';
import { speechService } from '../../services/speechService';
import { soundEffects } from '../../services/soundEffects';

interface CurriculumPreviewModalProps {
  topic: ConversationTopic;
  lesson: LessonSection;
  onClose: () => void;
}

export const CurriculumPreviewModal: React.FC<CurriculumPreviewModalProps> = ({
  topic,
  lesson,
  onClose
}) => {
  const [activeSpeechId, setActiveSpeechId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsub = speechService.subscribe((isSpeaking, _, currentId) => {
      setActiveSpeechId(isSpeaking ? currentId : null);
    });
    return () => unsub();
  }, []);

  const handlePlayAudio = (id: string, text: string) => {
    soundEffects.playClick();
    speechService.toggleSpeak(id, text);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-amber-400 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Teacher Live Preview Mode • How Students Experience This Lesson</span>
            </div>
            <h2 id="preview-title" className="text-2xl md:text-3xl font-black text-slate-900">
              {lesson.title}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Topic: {topic.title} • Category: {lesson.category || 'General'}
            </p>
          </div>

          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Close preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero banner preview */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 text-white p-6 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-extrabold text-blue-200 block">
                {topic.title} • Lesson Preview
              </span>
              <h3 className="text-2xl font-black">{lesson.title}</h3>
              {lesson.titleUz && (
                <p className="text-lg font-bold text-amber-300" lang="uz">
                  {lesson.titleUz}
                </p>
              )}
              {lesson.description && (
                <p className="text-sm text-blue-100 mt-1">{lesson.description}</p>
              )}
            </div>

            <button
              onClick={() => handlePlayAudio('preview-intro', `${lesson.title}. ${lesson.description || ''}`)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs flex items-center gap-2 shrink-0 shadow-md"
            >
              {activeSpeechId === 'preview-intro' ? <Square className="w-4 h-4 fill-amber-950" /> : <Volume2 className="w-4 h-4" />}
              <span>{activeSpeechId === 'preview-intro' ? 'Stop' : 'Listen in English'}</span>
            </button>
          </div>
        </div>

        {/* Vocabulary items preview */}
        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <BookOpen className="w-5 h-5 text-blue-700" />
              <h4 className="font-black text-lg text-slate-900">
                Vocabulary Words ({lesson.vocabulary.length})
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lesson.vocabulary.map((v, idx) => {
                const isPlaying = activeSpeechId === `preview-word-${idx}`;
                return (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-lg font-black text-blue-900 flex items-center gap-2">
                        <span>{v.english}</span>
                        <span className="text-slate-400 font-normal">—</span>
                        <span className="text-emerald-800 font-bold" lang="uz">{v.uzbek}</span>
                      </div>
                      {v.phonetic && <span className="text-xs font-mono text-slate-500 block">{v.phonetic}</span>}
                      {v.exampleSentence && (
                        <p className="text-xs text-slate-700 mt-1 italic">"{v.exampleSentence}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => handlePlayAudio(`preview-word-${idx}`, v.english)}
                      className="p-2 rounded-lg bg-white border border-slate-200 text-blue-700 hover:bg-blue-50"
                      aria-label={`Listen to ${v.english}`}
                    >
                      {isPlaying ? <Square className="w-3.5 h-3.5 fill-blue-700" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sentences preview */}
        {lesson.sentences && lesson.sentences.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sparkles className="w-5 h-5 text-purple-700" />
              <h4 className="font-black text-lg text-slate-900">
                Sentence Patterns ({lesson.sentences.length})
              </h4>
            </div>

            <div className="space-y-2">
              {lesson.sentences.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-purple-200 bg-purple-50/50">
                  <span className="text-xs font-bold uppercase text-purple-900 block">Pattern {idx + 1}</span>
                  <p className="text-base font-black text-slate-900">"{s.english}"</p>
                  <p className="text-sm font-semibold text-teal-800" lang="uz">"{s.uzbek}"</p>
                  {s.substitutions && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.substitutions.options.map((opt, oIdx) => (
                        <span key={oIdx} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-xs font-bold text-purple-900">
                          {opt.en} ({opt.uz})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expressions preview */}
        {lesson.items && lesson.items.length > 0 && (!lesson.vocabulary || lesson.vocabulary.length === 0) && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-5 h-5 text-blue-700" />
              <h4 className="font-black text-lg text-slate-900">Expressions ({lesson.items.length})</h4>
            </div>
            <ul className="space-y-2">
              {lesson.items.map((it, idx) => (
                <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900">
                  {it}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Dialogue preview */}
        {lesson.dialogue && lesson.dialogue.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <MessageSquare className="w-5 h-5 text-teal-700" />
              <h4 className="font-black text-lg text-slate-900">Conversation Dialogue</h4>
            </div>
            <div className="space-y-2">
              {lesson.dialogue.map((d, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-black uppercase text-teal-800">{d.speaker}</span>
                  <p className="text-sm font-bold text-slate-900">"{d.text}"</p>
                  {d.textUz && <p className="text-xs font-medium text-teal-800" lang="uz">"{d.textUz}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
};
