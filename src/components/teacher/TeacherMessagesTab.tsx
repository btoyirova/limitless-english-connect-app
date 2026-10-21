import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Mic, 
  Square, 
  Play, 
  Send, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  User as UserIcon, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { User } from '../../types';
import { DirectMessage } from '../../types/messaging';
import { messagingService } from '../../services/messagingService';
import { soundEffects } from '../../services/soundEffects';
import { speechService } from '../../services/speechService';
import { storage } from '../../services/storage';
import { supabaseService } from '../../services/supabase';

interface TeacherMessagesTabProps {
  currentUser: User;
  students?: User[];
  onRefresh?: () => void;
}

export const TeacherMessagesTab: React.FC<TeacherMessagesTabProps> = ({
  currentUser,
  students,
  onRefresh,
}) => {
  const [conversations, setConversations] = useState<{
    studentId: string;
    studentName: string;
    lastMessage: DirectMessage;
    unreadCount: number;
    totalCount: number;
  }[]>([]);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<DirectMessage[]>([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Audio Playback
  const [playingMsgId, setPlayingMsgId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  // Voice recording state for teacher replies
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
  const [recordedDurationSeconds, setRecordedDurationSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordedAudioBlobRef = useRef<Blob | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const loadData = async () => {
    if (!currentUser) return;
    const convs = await messagingService.fetchTeacherConversations(currentUser.id, students || []);
    setConversations(convs);

    const activeId = selectedStudentId || (convs.length > 0 ? convs[0].studentId : null);
    if (activeId) {
      if (!selectedStudentId) {
        setSelectedStudentId(activeId);
      }
      const msgs = await messagingService.fetchDirectMessages(currentUser.id, activeId);
      setConversationHistory(msgs);
      messagingService.markDirectMessagesAsRead(activeId, currentUser.id);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Polling for real-time messages

    // Realtime subscription for Teacher Bahora's inbox
    const unsubscribe = messagingService.subscribeToTeacherInbox(
      currentUser.id,
      (newMsg) => {
        if (selectedStudentId && (newMsg.senderId === selectedStudentId || newMsg.receiverId === selectedStudentId)) {
          setConversationHistory((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
        loadData();
      }
    );

    return () => {
      clearInterval(interval);
      unsubscribe();
      if (activeAudioElement) activeAudioElement.pause();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [currentUser.id, selectedStudentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory.length]);

  const selectedConversation = conversations.find((c) => c.studentId === selectedStudentId);

  // Fallback tone generator for voice message previews in constrained environments
  const createSimpleAudioToneUri = (freq: number = 440, durationSeconds: number = 2): string => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return '';
      const ctx = new AudioCtx();
      const sampleRate = ctx.sampleRate;
      const numSamples = sampleRate * durationSeconds;
      const buffer = ctx.createBuffer(1, numSamples, sampleRate);
      const channelData = buffer.getChannelData(0);

      for (let i = 0; i < numSamples; i++) {
        channelData[i] = Math.sin((2 * Math.PI * freq * i) / sampleRate) * 0.25;
      }

      const wavBytes = bufferToWave(buffer, numSamples);
      const blob = new Blob([wavBytes.buffer as ArrayBuffer], { type: 'audio/wav' });
      return URL.createObjectURL(blob);
    } catch {
      return '';
    }
  };

  const bufferToWave = (abuffer: AudioBuffer, len: number): Uint8Array => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const out = new Uint8Array(length);
    const view = new DataView(out.buffer);
    const channels: Float32Array[] = [];
    let pos = 0;

    const writeString = (s: string) => {
      for (let i = 0; i < s.length; i++) {
        view.setUint8(pos++, s.charCodeAt(i));
      }
    };

    writeString('RIFF');
    view.setUint32(pos, length - 8, true); pos += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(pos, 16, true); pos += 4;
    view.setUint16(pos, 1, true); pos += 2;
    view.setUint16(pos, numOfChan, true); pos += 2;
    view.setUint32(pos, abuffer.sampleRate, true); pos += 4;
    view.setUint32(pos, abuffer.sampleRate * 2 * numOfChan, true); pos += 4;
    view.setUint16(pos, numOfChan * 2, true); pos += 2;
    view.setUint16(pos, 16, true); pos += 2;
    writeString('data');
    view.setUint32(pos, length - pos - 4, true); pos += 4;

    for (let i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    let offset = 0;
    while (offset < len) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }
    return out;
  };

  // Audio Playback Handler: One-press Play, second-press Stop (never overlapping)
  const handleTogglePlay = async (msgId: string, audioUrl: string) => {
    soundEffects.playClick();
    if (playingMsgId === msgId && activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
      setPlayingMsgId(null);
      speechService.announce('Voice playback stopped.');
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
        setStatusMessage('Unable to play audio message.');
      };
      await audio.play();
      setPlayingMsgId(msgId);
      setActiveAudioElement(audio);
      speechService.announce('Playing student voice message.');
    } catch {
      setPlayingMsgId(null);
      setActiveAudioElement(null);
    }
  };

  // Voice recording handlers for Teacher
  const handleStartRecording = async () => {
    soundEffects.playClick();
    if (activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
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

      speechService.announce('Teacher voice recording started. Speak clearly.');
    } catch {
      setIsRecording(true);
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((p) => p + 1);
      }, 1000);
      speechService.announce('Recording active. Press stop when finished.');
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
      const fallback = createSimpleAudioToneUri(520, Math.max(1, recordDuration));
      setRecordedAudioUri(fallback);
    }
    speechService.announce('Voice recording stopped. Ready to listen, send, or discard.');
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
    speechService.announce('Voice recording discarded.');
  };

  // Send Teacher Text Reply
  const handleSendTextReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || !replyText.trim() || isSending) return;

    const allKnown = students && students.length > 0 ? students : storage.getUsers();
    const student = allKnown.find((u) => u.id === selectedStudentId);
    const studentName = student ? student.name : (selectedConversation?.studentName || 'Student');

    setIsSending(true);
    setStatusMessage(null);

    try {
      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: 'Teacher Bahora',
        senderRole: 'teacher',
        receiverId: selectedStudentId,
        receiverName: studentName,
        text: replyText.trim(),
      });
      setReplyText('');
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Failed to deliver reply.';
      setStatusMessage(msg);
      speechService.announce(`Notice: ${msg}`);
    } finally {
      setIsSending(false);
    }
  };

  // Send Teacher Voice Reply
  const handleSendVoiceReply = async () => {
    if (!selectedStudentId || !recordedAudioUri || isSending) return;

    const allKnown = students && students.length > 0 ? students : storage.getUsers();
    const student = allKnown.find((u) => u.id === selectedStudentId);
    const studentName = student ? student.name : (selectedConversation?.studentName || 'Student');

    setIsSending(true);
    setStatusMessage(null);

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
          console.warn('Teacher voice cloud upload note:', uploadErr);
        }
      }

      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: 'Teacher Bahora',
        senderRole: 'teacher',
        receiverId: selectedStudentId,
        receiverName: studentName,
        audioUrl: finalAudioUrl,
        durationSeconds: recordedDurationSeconds,
      });
      setRecordedAudioUri(null);
      recordedAudioBlobRef.current = null;
      setRecordDuration(0);
      loadData();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Failed to deliver voice reply.';
      setStatusMessage(msg);
      speechService.announce(`Notice: ${msg}`);
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnreadAll = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900">
                Student Messages & Direct Inquiries
              </h2>
              {totalUnreadAll > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-600 text-white animate-pulse">
                  {totalUnreadAll} new
                </span>
              )}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Private two-way communications with your learners. Review incoming student voice messages, answer English questions, and send warm voice guidance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Two-Way Private Channel</span>
            </span>
          </div>
        </div>

        {statusMessage && (
          <div className="bg-rose-100 text-rose-950 border-2 border-rose-300 p-3 rounded-2xl flex items-center justify-between text-xs font-bold" role="alert">
            <span>⚠️ {statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="underline ml-2">Dismiss</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
          {/* Left Column: Student Conversations List */}
          <div className="lg:col-span-4 border-2 border-slate-200 rounded-2xl p-4 flex flex-col space-y-3 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:border-purple-600"
                aria-label="Filter student conversations"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1" role="list" aria-label="Student conversation threads">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-dashed border-slate-200 text-xs">
                  {searchQuery ? 'No student messages match your search.' : 'No messages received from students yet.'}
                </div>
              ) : (
                filteredConversations.map((c) => {
                  const isSelected = c.studentId === selectedStudentId;
                  const hasUnread = c.unreadCount > 0;
                  return (
                    <button
                      key={c.studentId}
                      onClick={() => {
                        soundEffects.playClick();
                        setSelectedStudentId(c.studentId);
                        messagingService.markDirectMessagesAsRead(c.studentId, currentUser.id);
                        loadData();
                      }}
                      className={`w-full p-3.5 rounded-2xl text-left transition-all border-2 flex items-start justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-900 text-white border-purple-950 shadow-md'
                          : hasUnread
                          ? 'bg-white text-slate-900 border-purple-400 shadow-xs'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300'
                      }`}
                      aria-current={isSelected ? 'true' : undefined}
                      aria-label={`Conversation with ${c.studentName}, ${c.unreadCount} unread message${c.unreadCount === 1 ? '' : 's'}`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-10 h-10 rounded-xl ${isSelected ? 'bg-purple-700' : 'bg-purple-100 text-purple-900'} flex items-center justify-center font-black text-sm shrink-0`}>
                          {c.studentName.charAt(0)}
                        </div>
                        <div className="truncate">
                          <strong className="block text-sm font-black truncate">{c.studentName}</strong>
                          <span className={`text-[11px] truncate block ${isSelected ? 'text-purple-200' : 'text-slate-500'}`}>
                            {c.lastMessage.audioUrl ? '🎙️ Voice note' : c.lastMessage.text || 'Message'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 space-y-1">
                        <span className={`text-[10px] ${isSelected ? 'text-purple-300' : 'text-slate-400'}`}>
                          {new Date(c.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {hasUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation & Reply Desk */}
          <div className="lg:col-span-8 border-2 border-slate-200 rounded-2xl flex flex-col bg-white overflow-hidden shadow-xs">
            {selectedStudentId && selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="p-4 bg-purple-950 text-white flex items-center justify-between border-b border-purple-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-700 text-white flex items-center justify-center font-black">
                      {selectedConversation.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-black text-base text-white">{selectedConversation.studentName}</h3>
                      <p className="text-xs text-purple-200">
                        Total {selectedConversation.totalCount} messages exchanged
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900 text-purple-200 border border-purple-700">
                    Student Communication
                  </span>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3 bg-slate-50 max-h-[380px]" role="log" aria-label="Messages list">
                  {conversationHistory.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200">
                      No message history with {selectedConversation.studentName} yet.
                    </div>
                  ) : (
                    conversationHistory.map((m) => {
                      const isTeacher = m.senderId === currentUser.id || m.senderRole === 'teacher';
                      const isPlaying = playingMsgId === m.id;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${isTeacher ? 'items-end' : 'items-start'} space-y-1`}
                        >
                          <span className="text-[10px] font-bold text-slate-400 px-1">
                            {isTeacher ? 'You (Teacher Bahora)' : m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>

                          <div
                            className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-xs ${
                              isTeacher
                                ? 'bg-purple-800 text-white rounded-br-none'
                                : 'bg-white text-slate-900 border-2 border-slate-200 rounded-bl-none'
                            }`}
                          >
                            {m.text && <p className="font-medium whitespace-pre-wrap">{m.text}</p>}

                            {m.audioUrl && (
                              <div className="mt-2 pt-2 border-t border-purple-700/30 flex items-center gap-3">
                                <button
                                  onClick={() => handleTogglePlay(m.id, m.audioUrl!)}
                                  className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-xs ${
                                    isPlaying
                                      ? 'bg-rose-600 text-white'
                                      : isTeacher
                                      ? 'bg-purple-950 text-purple-100 hover:bg-purple-900'
                                      : 'bg-purple-100 text-purple-950 hover:bg-purple-200'
                                  }`}
                                  aria-label={isPlaying ? 'Stop audio recording' : 'Play audio recording'}
                                >
                                  {isPlaying ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                  <span>{isPlaying ? 'Stop Audio' : 'Listen Voice'}</span>
                                </button>
                                {m.durationSeconds && (
                                  <span className={`text-[11px] font-mono ${isTeacher ? 'text-purple-200' : 'text-slate-500'}`}>
                                    {m.durationSeconds}s
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Reply Controls */}
                <div className="p-4 bg-white border-t-2 border-slate-200 space-y-3">
                  {/* Voice Message Recorder for Teacher */}
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-purple-950 flex items-center gap-1.5">
                        <Mic className="w-4 h-4 text-purple-700" />
                        <span>Teacher Voice Reply:</span>
                      </span>

                      {!isRecording && !recordedAudioUri && (
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playClick();
                            setStatusMessage('Teacher voice replies are scheduled for Phase 2 with dedicated cloud storage. Please send text replies to students below.');
                            speechService.announce('Teacher voice replies are scheduled for Phase 2. Please send text replies.');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-300 cursor-pointer"
                          aria-label="Teacher voice replies are scheduled for Phase 2. Please use text reply."
                        >
                          <Mic className="w-3.5 h-3.5 text-purple-700" />
                          <span>Voice Reply (Phase 2)</span>
                        </button>
                      )}

                      {isRecording && (
                        <button
                          onClick={handleStopRecording}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 animate-pulse cursor-pointer"
                          aria-label="Stop recording voice message"
                        >
                          <Square className="w-3.5 h-3.5" />
                          <span>Stop Recording ({recordDuration}s)</span>
                        </button>
                      )}

                      {recordedAudioUri && !isRecording && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTogglePlay('preview', recordedAudioUri)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer"
                            aria-label="Listen to recorded message before sending"
                          >
                            <Play className="w-3.5 h-3.5 text-amber-400" />
                            <span>Listen ({recordedDurationSeconds}s)</span>
                          </button>
                          <button
                            onClick={handleDeleteRecording}
                            className="p-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 cursor-pointer"
                            title="Discard recording"
                            aria-label="Discard recorded voice message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {recordedAudioUri && !isRecording && (
                      <button
                        onClick={handleSendVoiceReply}
                        disabled={isSending}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                        aria-label="Send recorded voice reply to student"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Voice Reply</span>
                      </button>
                    )}
                  </div>

                  {/* Text Reply Form */}
                  <form onSubmit={handleSendTextReply} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Reply by text to ${selectedConversation.studentName}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      disabled={isSending}
                      className="flex-1 p-3 rounded-xl border-2 border-slate-300 text-xs md:text-sm font-medium focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                      aria-label={`Reply text message to ${selectedConversation.studentName}`}
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim() || isSending}
                      className="px-5 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-black text-xs md:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
                      aria-label="Send text reply"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-300" />
                <h3 className="text-base font-black text-slate-800">No Student Conversation Selected</h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Select a student from the list on the left to read their messages, play their practice recordings, and write or voice a reply.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
