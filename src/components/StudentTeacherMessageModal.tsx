import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Mic, 
  Square, 
  Play, 
  Trash2, 
  Volume2, 
  CheckCheck, 
  Clock, 
  Sparkles,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { User } from '../types';
import { DirectMessage } from '../types/messaging';
import { messagingService } from '../services/messagingService';
import { storage } from '../services/storage';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { supabaseService } from '../services/supabase';

interface StudentTeacherMessageModalProps {
  currentUser: User;
  onClose: () => void;
}

export const StudentTeacherMessageModal: React.FC<StudentTeacherMessageModalProps> = ({
  currentUser,
  onClose,
}) => {
  // Discover assigned teacher
  const [teacher, setTeacher] = useState<User>(() => {
    try {
      const cached = localStorage.getItem('le_verified_teacher_uuid_v1');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed?.id && parsed.id.length > 20) {
          return parsed;
        }
      }
    } catch {}

    const teachers = storage.getUsers().filter((u) => u.role === 'teacher' && u.isApproved);
    const bahora = teachers.find((t) => t.name.toLowerCase().includes('bahora') || t.id.includes('bahora'));
    return bahora || teachers[0] || {
      id: 'teacher-bahora',
      name: 'Teacher Bahora',
      email: 'btoyirova1982@gmail.com',
      role: 'teacher',
      ageGroup: 'adult',
      visionPreference: 'standard',
      isApproved: true,
      avatarColor: 'bg-purple-700',
      createdAt: '2026-01-01',
    };
  });

  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
  const [recordedDurationSeconds, setRecordedDurationSeconds] = useState<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedAudioBlobRef = useRef<Blob | null>(null);

  // Playback State (1st press Play, 2nd press Stop, 3rd press Play; no overlap)
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Dynamically resolve verified teacher profile from Supabase or server
  useEffect(() => {
    let isMounted = true;
    async function resolveTeacher() {
      try {
        const dbTeacher = await supabaseService.getVerifiedTeacher();
        if (isMounted && dbTeacher && dbTeacher.id) {
          setTeacher(dbTeacher);
        }
      } catch (err) {
        console.warn('Could not resolve verified teacher profile:', err);
      }
    }
    resolveTeacher();
    return () => { isMounted = false; };
  }, []);

  const loadConversation = async () => {
    try {
      const history = await messagingService.fetchDirectMessages(currentUser.id, teacher.id);
      setMessages(history);
      messagingService.markDirectMessagesAsRead(teacher.id, currentUser.id);
    } catch {
      const history = messagingService.getDirectMessages(currentUser.id, teacher.id);
      setMessages(history);
    }
  };

  useEffect(() => {
    loadConversation();
    const interval = setInterval(loadConversation, 3000); // Polling for live updates

    // Realtime WebSocket subscription for instant peer messages
    const unsubscribe = messagingService.subscribeToDirectMessages(
      currentUser.id,
      teacher.id,
      (newMsg) => {
        setMessages((prev) => {
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          return [...prev, newMsg];
        });
        messagingService.markDirectMessagesAsRead(teacher.id, currentUser.id);
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
      if (activeAudioElement) activeAudioElement.pause();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [currentUser.id, teacher.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Handle Text Send
  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setErrorMessage(null);
    setIsSending(true);
    try {
      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        receiverId: teacher.id,
        receiverName: teacher.name,
        text: inputText.trim(),
      });
      setInputText('');
      loadConversation();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Failed to send message.';
      setErrorMessage(msg);
      speechService.announce(`Notice: ${msg}`);
    } finally {
      setIsSending(false);
    }
  };

  // --- VOICE RECORDING HANDLERS ---
  const handleStartRecording = async () => {
    soundEffects.playClick();
    if (activeAudioElement) {
      activeAudioElement.pause();
      setPlayingMsgId(null);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        recordedAudioBlobRef.current = audioBlob;
        const uri = URL.createObjectURL(audioBlob);
        setRecordedAudioUri(uri);
        stream.getTracks().forEach((track) => track.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setRecordDuration(0);

      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => {
          if (prev >= 60) {
            handleStopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);

      speechService.announce('Voice recording started. Speak your message clearly.');
    } catch {
      // Fallback for demo environments without real mic hardware
      setIsRecording(true);
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((p) => p + 1);
      }, 1000);
      speechService.announce('Recording simulated. Press stop when done.');
    }
  };

  const handleStopRecording = () => {
    soundEffects.playClick();
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordedDurationSeconds(Math.max(1, recordDuration));

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!recordedAudioUri) {
      // Fallback generated audio tone
      const fallbackUri = createSimpleAudioToneUri(440, Math.max(1, recordDuration));
      setRecordedAudioUri(fallbackUri);
    }
    speechService.announce('Recording stopped. You can listen, send, or delete.');
  };

  const handleDeleteRecording = () => {
    soundEffects.playClick();
    if (recordedAudioUri) {
      URL.revokeObjectURL(recordedAudioUri);
    }
    recordedAudioBlobRef.current = null;
    setRecordedAudioUri(null);
    setRecordDuration(0);
    setRecordedDurationSeconds(0);
    speechService.announce('Recording discarded.');
  };

  const handleSendVoiceMessage = async () => {
    if (!recordedAudioUri || isSending) return;
    setErrorMessage(null);
    setIsSending(true);
    try {
      let finalAudioUrl = recordedAudioUri;

      // Upload to private Supabase Storage bucket 'voice-messages'
      if (recordedAudioBlobRef.current && supabaseService.isConfigured()) {
        try {
          const cloudSignedUrl = await supabaseService.uploadVoiceMessage(
            recordedAudioBlobRef.current,
            currentUser.id
          );
          if (cloudSignedUrl) {
            finalAudioUrl = cloudSignedUrl;
          }
        } catch (uploadErr) {
          console.warn('Voice message cloud upload note:', uploadErr);
        }
      }

      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        receiverId: teacher.id,
        receiverName: teacher.name || 'Teacher Bahora',
        audioUrl: finalAudioUrl,
        durationSeconds: recordedDurationSeconds,
      });
      setRecordedAudioUri(null);
      recordedAudioBlobRef.current = null;
      setRecordDuration(0);
      loadConversation();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending voice message.';
      setErrorMessage(msg);
      speechService.announce(`Notice: ${msg}`);
    } finally {
      setIsSending(false);
    }
  };

  // Play/Stop toggle for any audio message
  const handleTogglePlay = async (msgId: string, audioUrl: string) => {
    soundEffects.playClick();
    if (playingMsgId === msgId && activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
      setPlayingMsgId(null);
      return;
    }

    if (activeAudioElement) {
      activeAudioElement.pause();
    }

    try {
      const playableUrl = await supabaseService.getAudioPlaybackUrl(audioUrl);
      const audio = new Audio(playableUrl);
      audio.onended = () => {
        setPlayingMsgId(null);
        setActiveAudioElement(null);
      };
      audio.onerror = () => {
        setPlayingMsgId(null);
        setActiveAudioElement(null);
        setErrorMessage('Unable to play audio message.');
      };
      await audio.play();
      setActiveAudioElement(audio);
      setPlayingMsgId(msgId);
    } catch {
      setPlayingMsgId(null);
      setActiveAudioElement(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="msg-teacher-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] max-h-[750px] flex flex-col border-4 border-purple-600 shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="p-4 md:p-5 bg-linear-to-r from-purple-800 to-indigo-900 text-white flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-xl shadow-inner border border-purple-400">
              {teacher.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="msg-teacher-title" className="text-lg md:text-xl font-black text-white">
                  {teacher.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-emerald-950 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Teacher
                </span>
              </div>
              <p className="text-xs text-purple-200">
                Private Educational Conversation • English Questions & Voice Notes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeAudioElement) activeAudioElement.pause();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close conversation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="bg-rose-100 text-rose-900 border-b-2 border-rose-300 px-4 py-2.5 flex items-center justify-between text-xs font-bold" role="alert" aria-live="assertive">
            <span>⚠️ {errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-rose-800 hover:text-rose-950 font-black ml-3 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Conversation Body */}
        <div 
          className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50"
          role="log"
          aria-live="polite"
          aria-label="Message history with your teacher"
        >
          {messages.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
              <Sparkles className="w-8 h-8 text-purple-600 mx-auto" />
              <h3 className="text-base font-black text-slate-900">Start a conversation with {teacher.name}!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Ask questions about your vocabulary lessons, request pronunciation checks, or send a warm hello.
              </p>
            </div>
          ) : (
            messages.map((m) => {
              const isMe = m.senderId === currentUser.id;
              const isPlaying = playingMsgId === m.id;

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <span className="text-[10px] font-bold text-slate-400 px-1">
                    {isMe ? 'You' : m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-purple-700 text-white rounded-br-none'
                        : 'bg-white text-slate-900 border-2 border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {/* Text content */}
                    {m.text && <p className="font-medium whitespace-pre-wrap">{m.text}</p>}

                    {/* Audio recording player */}
                    {m.audioUrl && (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => handleTogglePlay(m.id, m.audioUrl!)}
                          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer ${
                            isMe
                              ? 'bg-purple-900 hover:bg-purple-950 text-white'
                              : 'bg-purple-100 hover:bg-purple-200 text-purple-900 border border-purple-300'
                          }`}
                          aria-label={isPlaying ? 'Stop voice message' : `Play voice message (${m.durationSeconds || 3} seconds)`}
                        >
                          {isPlaying ? (
                            <>
                              <Square className="w-3.5 h-3.5 fill-current" />
                              <span>Stop Audio</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Play Voice Note ({m.durationSeconds || 3}s)</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Recording Drawer (if recording or pending send) */}
        {(isRecording || recordedAudioUri) && (
          <div className="p-4 bg-purple-50 border-t-2 border-purple-200 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
              <span className={`w-3.5 h-3.5 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-purple-600'}`} />
              <div>
                <span className="text-xs font-black text-purple-950">
                  {isRecording ? `Recording Voice Message (${recordDuration}s / 60s max)...` : `Recorded Voice Clip (${recordedDurationSeconds}s)`}
                </span>
                <span className="text-[10px] text-purple-800 block font-medium">
                  {isRecording ? 'Speak clearly into your microphone' : 'Review below before sending'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isRecording ? (
                <button
                  onClick={handleStopRecording}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Square className="w-3.5 h-3.5 fill-white" />
                  <span>Stop Recording</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleTogglePlay('preview', recordedAudioUri!)}
                    className="px-3.5 py-2 rounded-xl bg-purple-200 hover:bg-purple-300 text-purple-950 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {playingMsgId === 'preview' ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-purple-950" />}
                    <span>{playingMsgId === 'preview' ? 'Stop Listening' : 'Listen to Recording'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDeleteRecording}
                    className="px-3 py-2 rounded-xl text-rose-700 bg-rose-100 hover:bg-rose-200 font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Delete Recording"
                    aria-label="Delete Recording"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Recording</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendVoiceMessage}
                    disabled={isSending}
                    className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Voice Message</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Message Input Form */}
        <form onSubmit={handleSendText} className="p-3 md:p-4 bg-white border-t border-slate-200 flex flex-wrap sm:flex-nowrap items-center gap-2">
          {!isRecording && !recordedAudioUri && (
            <button
              type="button"
              onClick={() => {
                soundEffects.playClick();
                setErrorMessage('Voice messaging will be activated in Phase 2 with dedicated private audio storage. Please type your message below to send directly to Teacher Bahora.');
                speechService.announce('Voice messaging will be activated in Phase 2. Please type your text message to Teacher Bahora.');
              }}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border-2 border-slate-300 transition-colors cursor-pointer shrink-0"
              title="Voice Notes: Coming Soon in Phase 2"
              aria-label="Voice Notes: Coming Soon in Phase 2. Please send your question as text."
            >
              <Mic className="w-4 h-4 text-purple-600" />
              <span>Voice Note (Phase 2)</span>
            </button>
          )}

          <input
            type="text"
            placeholder={`Message ${teacher.name}... (Press enter to send)`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isRecording}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-purple-600 focus:ring-4 focus:ring-purple-100 text-sm font-medium"
            aria-label="Write text message to teacher"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-sm flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Send text message"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

// Helper to create simple WAV tone audio URI for fallback recording environments
function createSimpleAudioToneUri(frequency: number, durationSec: number): string {
  if (typeof window === 'undefined') return '';
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const wave = Math.sin(2 * Math.PI * frequency * t) * 0.25;
    const val = Math.max(-1, Math.min(1, wave));
    view.setInt16(offset, val < 0 ? val * 0x8000 : val * 0x7fff, true);
    offset += 2;
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}
