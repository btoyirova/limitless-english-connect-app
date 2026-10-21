import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Users, 
  MessageSquare, 
  MessagesSquare, 
  Mic, 
  Square, 
  Play, 
  Send, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Ban, 
  UserCheck, 
  Plus, 
  Volume2, 
  Clock, 
  Eye, 
  EyeOff, 
  Search,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { User } from '../types';
import { 
  DirectMessage, 
  StudentPresenceProfile, 
  CommunityGroupChat, 
  CommunityGroupMessage, 
  UserAvailabilityStatus 
} from '../types/messaging';
import { messagingService } from '../services/messagingService';
import { storage } from '../services/storage';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';

interface StudentCommunityModalProps {
  currentUser: User;
  onClose: () => void;
  onOpenReport?: (reportedUser: User) => void;
}

export const StudentCommunityModal: React.FC<StudentCommunityModalProps> = ({
  currentUser,
  onClose,
  onOpenReport,
}) => {
  const [activeTab, setActiveTab] = useState<'available' | 'private' | 'groups'>('available');

  // Presence & available students
  const [presenceList, setPresenceList] = useState<StudentPresenceProfile[]>([]);
  const [myPresence, setMyPresence] = useState<StudentPresenceProfile>(() => {
    return messagingService.getCommunityPresence().find((p) => p.studentId === currentUser.id) || {
      studentId: currentUser.id,
      studentName: currentUser.name,
      avatarColor: currentUser.avatarColor || 'bg-blue-600',
      ageGroup: currentUser.ageGroup,
      visionPreference: currentUser.visionPreference,
      status: 'available',
      isDiscoverable: true,
      allowIncomingMessages: true,
      lastActiveAt: new Date().toISOString(),
    };
  });

  // Selected peer for private chat
  const [selectedPeer, setSelectedPeer] = useState<StudentPresenceProfile | null>(null);
  const [privateMessages, setPrivateMessages] = useState<DirectMessage[]>([]);
  const [privateInputText, setPrivateInputText] = useState('');

  // Groups
  const [groups, setGroups] = useState<CommunityGroupChat[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroupChat | null>(null);
  const [groupMessages, setGroupMessages] = useState<CommunityGroupMessage[]>([]);
  const [groupInputText, setGroupInputText] = useState('');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
  const [recordedDurationSeconds, setRecordedDurationSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Playback
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [activeAudioElement, setActiveAudioElement] = useState<HTMLAudioElement | null>(null);

  // Status message notice
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  const loadData = () => {
    const available = messagingService.getAvailableStudents(currentUser);
    setPresenceList(available);

    const grps = messagingService.getGroupChats();
    setGroups(grps);

    if (selectedPeer) {
      const dms = messagingService.getDirectMessages(currentUser.id, selectedPeer.studentId);
      setPrivateMessages(dms);
      messagingService.markDirectMessagesAsRead(selectedPeer.studentId, currentUser.id);
    }

    if (selectedGroup) {
      const gms = messagingService.getGroupMessages(selectedGroup.id);
      setGroupMessages(gms);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000); // Polling for real-time community updates
    return () => {
      clearInterval(interval);
      if (activeAudioElement) activeAudioElement.pause();
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [currentUser.id, selectedPeer?.studentId, selectedGroup?.id]);

  // Update own availability status
  const handleUpdateStatus = (newStatus: UserAvailabilityStatus) => {
    soundEffects.playClick();
    const updated = messagingService.updateMyPresence(currentUser.id, { status: newStatus });
    setMyPresence(updated);
    speechService.announce(`Your presence status changed to ${newStatus}.`);
  };

  const handleToggleDiscoverability = () => {
    soundEffects.playClick();
    const updated = messagingService.updateMyPresence(currentUser.id, { 
      isDiscoverable: !myPresence.isDiscoverable 
    });
    setMyPresence(updated);
    speechService.announce(`Classmate discoverability turned ${updated.isDiscoverable ? 'on' : 'off'}.`);
  };

  // --- PRIVATE CHAT SEND ---
  const handleSendPrivateText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeer || !privateInputText.trim()) return;

    try {
      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        receiverId: selectedPeer.studentId,
        receiverName: selectedPeer.studentName,
        text: privateInputText.trim(),
      });
      setPrivateInputText('');
      loadData();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending message.';
      setStatusNotice(msg);
      speechService.announce(`Notice: ${msg}`);
    }
  };

  const handleSendPrivateVoice = async () => {
    if (!selectedPeer || !recordedAudioUri) return;
    try {
      await messagingService.sendDirectMessage({
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        receiverId: selectedPeer.studentId,
        receiverName: selectedPeer.studentName,
        audioUrl: recordedAudioUri,
        durationSeconds: recordedDurationSeconds,
      });
      setRecordedAudioUri(null);
      setRecordDuration(0);
      loadData();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending voice message.';
      setStatusNotice(msg);
      speechService.announce(`Notice: ${msg}`);
    }
  };

  // --- GROUP CHAT SEND ---
  const handleSendGroupText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !groupInputText.trim()) return;

    try {
      await messagingService.sendGroupMessage({
        groupId: selectedGroup.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        senderAvatarColor: currentUser.avatarColor || 'bg-blue-600',
        text: groupInputText.trim(),
      });
      setGroupInputText('');
      loadData();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending message to group.';
      setStatusNotice(msg);
      speechService.announce(`Notice: ${msg}`);
    }
  };

  const handleSendGroupVoice = async () => {
    if (!selectedGroup || !recordedAudioUri) return;
    try {
      await messagingService.sendGroupMessage({
        groupId: selectedGroup.id,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderRole: 'student',
        senderAvatarColor: currentUser.avatarColor || 'bg-blue-600',
        audioUrl: recordedAudioUri,
        durationSeconds: recordedDurationSeconds,
      });
      setRecordedAudioUri(null);
      setRecordDuration(0);
      loadData();
    } catch (err: any) {
      soundEffects.playWarning();
      const msg = err?.message || 'Error sending voice message to group.';
      setStatusNotice(msg);
      speechService.announce(`Notice: ${msg}`);
    }
  };

  // --- VOICE RECORDING HANDLERS ---
  const handleStartRecording = async () => {
    soundEffects.playClick();
    if (activeAudioElement) activeAudioElement.pause();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const uri = URL.createObjectURL(audioBlob);
        setRecordedAudioUri(uri);
        stream.getTracks().forEach((track) => track.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
      setRecordDuration(0);

      recordTimerRef.current = setInterval(() => {
        setRecordDuration((prev) => (prev >= 60 ? 60 : prev + 1));
      }, 1000);

      speechService.announce('Recording voice message. Press stop when finished.');
    } catch {
      setIsRecording(true);
      setRecordDuration(0);
      recordTimerRef.current = setInterval(() => {
        setRecordDuration((p) => p + 1);
      }, 1000);
      speechService.announce('Recording simulated in preview environment.');
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
      const fallbackUri = createSimpleAudioToneUri(380, Math.max(1, recordDuration));
      setRecordedAudioUri(fallbackUri);
    }
    speechService.announce('Recording stopped. Review or send.');
  };

  const handleDeleteRecording = () => {
    soundEffects.playClick();
    if (recordedAudioUri) URL.revokeObjectURL(recordedAudioUri);
    setRecordedAudioUri(null);
    setRecordDuration(0);
    setRecordedDurationSeconds(0);
    speechService.announce('Recording deleted.');
  };

  // Play / Stop toggle (never overlap)
  const handleTogglePlay = (id: string, audioUrl: string) => {
    soundEffects.playClick();
    if (playingAudioId === id && activeAudioElement) {
      activeAudioElement.pause();
      setActiveAudioElement(null);
      setPlayingAudioId(null);
      return;
    }

    if (activeAudioElement) {
      activeAudioElement.pause();
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setPlayingAudioId(null);
      setActiveAudioElement(null);
    };
    audio.play();
    setActiveAudioElement(audio);
    setPlayingAudioId(id);
  };

  // Block a student
  const handleBlockPeer = (peerId: string, peerName: string) => {
    if (window.confirm(`Are you sure you want to block ${peerName}? They will no longer be able to message you.`)) {
      messagingService.blockUser(currentUser.id, peerId);
      soundEffects.playWarning();
      speechService.announce(`Blocked ${peerName}.`);
      setSelectedPeer(null);
      loadData();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/80 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="community-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] max-h-[800px] flex flex-col border-4 border-blue-600 shadow-2xl overflow-hidden animate-in fade-in">
        {/* Header */}
        <div className="p-4 md:p-6 bg-linear-to-r from-blue-800 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-inner border border-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="community-modal-title" className="text-xl md:text-2xl font-black text-white">
                  Student Learning Community
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-300 text-blue-950">
                  {currentUser.ageGroup.toUpperCase()} COHORT
                </span>
              </div>
              <p className="text-xs text-blue-200">
                Practice English together safely • Available Classmates, Private Messages & Group Chats
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* My Presence Indicator Button */}
            <div className="flex items-center gap-1.5 bg-blue-950/80 px-3 py-1.5 rounded-xl border border-blue-400 text-xs font-bold">
              <span className={`w-2.5 h-2.5 rounded-full ${
                myPresence.status === 'available' ? 'bg-emerald-400 animate-pulse' :
                myPresence.status === 'busy' ? 'bg-amber-400' : 'bg-slate-400'
              }`} />
              <span className="capitalize">{myPresence.status}</span>
              <button
                onClick={() => handleUpdateStatus(myPresence.status === 'available' ? 'busy' : myPresence.status === 'busy' ? 'offline' : 'available')}
                className="ml-1 text-[10px] text-blue-300 hover:text-white underline cursor-pointer"
                title="Change presence status"
              >
                (Change)
              </button>
            </div>

            <button
              onClick={() => {
                if (activeAudioElement) activeAudioElement.pause();
                onClose();
              }}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              aria-label="Close Community"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Safeguarding & Coming Soon Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-900 font-medium">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Phase 1 Safeguard Notice:</strong> Open student group chats and unmoderated peer messaging are scheduled for Phase 2 following full safeguarding compliance. To speak directly with your instructor, use <strong>Message Teacher</strong>.
          </span>
        </div>

        {/* 3 Main Community Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-100 px-4 md:px-6 gap-2 overflow-x-auto" role="tablist">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('available');
              setSelectedPeer(null);
            }}
            role="tab"
            aria-selected={activeTab === 'available'}
            className={`py-3.5 px-5 font-black text-xs md:text-sm border-b-4 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'available'
                ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Available Students ({presenceList.length})</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('private');
            }}
            role="tab"
            aria-selected={activeTab === 'private'}
            className={`py-3.5 px-5 font-black text-xs md:text-sm border-b-4 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'private'
                ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Private Messages {selectedPeer ? `with ${selectedPeer.studentName}` : ''}</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('groups');
            }}
            role="tab"
            aria-selected={activeTab === 'groups'}
            className={`py-3.5 px-5 font-black text-xs md:text-sm border-b-4 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'groups'
                ? 'border-blue-600 text-blue-900 bg-white shadow-2xs'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessagesSquare className="w-4 h-4" />
            <span>Group Chats ({groups.length})</span>
          </button>
        </div>

        {/* Status / Error alert banner */}
        {statusNotice && (
          <div className="bg-rose-100 text-rose-900 border-b-2 border-rose-300 px-4 py-2.5 flex items-center justify-between text-xs font-bold" role="alert" aria-live="assertive">
            <span>⚠️ {statusNotice}</span>
            <button 
              onClick={() => setStatusNotice(null)} 
              className="text-rose-800 hover:text-rose-950 font-black ml-3 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Available Students */}
        {activeTab === 'available' && (
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 bg-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Only eligible classmates in your verified cohort ({currentUser.ageGroup}) are discoverable.</span>
              </div>
              <button
                onClick={handleToggleDiscoverability}
                className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {myPresence.isDiscoverable ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-500" />}
                <span>{myPresence.isDiscoverable ? 'Visible to Classmates' : 'Hidden from Classmates'}</span>
              </button>
            </div>

            {presenceList.length === 0 ? (
              <div className="p-12 text-center text-slate-500 font-bold bg-white rounded-2xl border border-slate-200 space-y-2">
                <Users className="w-8 h-8 text-blue-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900">No other classmates are currently discoverable.</h3>
                <p className="text-xs text-slate-600">
                  When other verified {currentUser.ageGroup} learners log in and enable discoverability, they will appear here!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {presenceList.map((p) => {
                  return (
                    <div
                      key={p.studentId}
                      className="p-5 rounded-2xl bg-white border-2 border-slate-200 hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between space-y-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${p.avatarColor || 'bg-blue-600'} text-white flex items-center justify-center font-black text-base shadow-xs`}>
                            {p.studentName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-slate-900 text-base">{p.studentName}</h3>
                              <span className={`w-2.5 h-2.5 rounded-full ${
                                p.status === 'available' ? 'bg-emerald-500' :
                                p.status === 'busy' ? 'bg-amber-500' : 'bg-slate-400'
                              }`} />
                            </div>
                            <span className="text-xs text-slate-500 capitalize">
                              Status: <strong>{p.status}</strong> • {p.visionPreference}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleBlockPeer(p.studentId, p.studentName)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                          title="Block student"
                          aria-label={`Block ${p.studentName}`}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedPeer(p);
                            setActiveTab('private');
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message</span>
                        </button>

                        <button
                          onClick={() => {
                            soundEffects.playClick();
                            setSelectedPeer(p);
                            setActiveTab('private');
                            handleStartRecording();
                          }}
                          className="py-2.5 px-3.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-black text-xs flex items-center justify-center gap-1 border border-purple-300 cursor-pointer"
                          title="Send Voice Message"
                          aria-label={`Send voice message to ${p.studentName}`}
                        >
                          <Mic className="w-3.5 h-3.5 text-purple-700" />
                          <span>Voice</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Private Messages */}
        {activeTab === 'private' && (
          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
            {!selectedPeer ? (
              <div className="flex-1 p-8 text-center text-slate-500 font-bold flex flex-col items-center justify-center space-y-3">
                <MessageSquare className="w-12 h-12 text-blue-600" />
                <h3 className="text-lg font-black text-slate-900">Select a Classmate to Message Privately</h3>
                <p className="text-xs text-slate-600 max-w-sm">
                  Click "Available Students" above and choose who you would like to practice English with.
                </p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="px-5 py-2.5 rounded-xl bg-blue-700 text-white font-black text-xs"
                >
                  View Available Classmates
                </button>
              </div>
            ) : (
              <>
                {/* Chat Partner Header Bar */}
                <div className="p-3 px-6 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${selectedPeer.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      {selectedPeer.studentName.charAt(0)}
                    </div>
                    <div>
                      <strong className="text-slate-900 text-sm font-black">{selectedPeer.studentName}</strong>
                      <span className="text-[10px] text-slate-500 block capitalize">Status: {selectedPeer.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenReport && (
                      <button
                        onClick={() => onOpenReport(storage.getUserById(selectedPeer.studentId) || currentUser)}
                        className="p-1.5 rounded-lg text-amber-700 hover:bg-amber-50 text-xs font-bold border border-amber-300 flex items-center gap-1"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Report</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleBlockPeer(selectedPeer.studentId, selectedPeer.studentName)}
                      className="p-1.5 rounded-lg text-rose-700 hover:bg-rose-50 text-xs font-bold border border-rose-300 flex items-center gap-1"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Block</span>
                    </button>
                  </div>
                </div>

                {/* Messages Log */}
                <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
                  {privateMessages.length === 0 ? (
                    <div className="p-6 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200 text-xs">
                      Say hello to {selectedPeer.studentName}! Practice your English greeting together.
                    </div>
                  ) : (
                    privateMessages.map((m) => {
                      const isMe = m.senderId === currentUser.id;
                      const isPlaying = playingAudioId === m.id;
                      return (
                        <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                          <span className="text-[10px] text-slate-400 font-bold px-1">
                            {isMe ? 'You' : m.senderName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs md:text-sm shadow-2xs ${
                            isMe ? 'bg-blue-700 text-white rounded-br-none' : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                          }`}>
                            {m.text && <p className="font-medium whitespace-pre-wrap">{m.text}</p>}
                            {m.audioUrl && (
                              <div className="pt-2">
                                <button
                                  onClick={() => handleTogglePlay(m.id, m.audioUrl!)}
                                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                                    isMe ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'
                                  }`}
                                >
                                  {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                  <span>{isPlaying ? 'Stop' : `Play Voice Note (${m.durationSeconds || 3}s)`}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Voice Drawer for Private Message */}
                {(isRecording || recordedAudioUri) && (
                  <div className="p-3 bg-purple-50 border-t border-purple-200 flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-purple-950">
                      {isRecording ? `Recording (${recordDuration}s)...` : `Voice note ready (${recordedDurationSeconds}s)`}
                    </span>
                    <div className="flex items-center gap-2">
                      {isRecording ? (
                        <button onClick={handleStopRecording} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1">
                          <Square className="w-3 h-3" /> Stop
                        </button>
                      ) : (
                        <>
                          <button onClick={() => handleTogglePlay('prev-priv', recordedAudioUri!)} className="px-3 py-1.5 rounded-xl bg-purple-200 text-purple-900 font-bold text-xs">
                            {playingAudioId === 'prev-priv' ? 'Stop' : 'Listen'}
                          </button>
                          <button onClick={handleDeleteRecording} className="p-1.5 text-rose-600">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button onClick={handleSendPrivateVoice} className="px-4 py-1.5 rounded-xl bg-blue-700 text-white font-black text-xs flex items-center gap-1">
                            <Send className="w-3 h-3" /> Send
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Input Bar */}
                <form onSubmit={handleSendPrivateText} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  {!isRecording && !recordedAudioUri && (
                    <button
                      type="button"
                      onClick={handleStartRecording}
                      className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                      title="Record voice note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    type="text"
                    placeholder={`Message ${selectedPeer.studentName}...`}
                    value={privateInputText}
                    onChange={(e) => setPrivateInputText(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!privateInputText.trim()}
                    className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </div>
        )}

        {/* Tab 3: Group Chats */}
        {activeTab === 'groups' && (
          <div className="flex-1 flex flex-col md:flex-row bg-slate-50 overflow-hidden">
            {/* Left: Group List */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200 p-3 space-y-2 overflow-y-auto">
              <span className="text-[10px] font-black uppercase text-slate-500 block">Class Groups ({groups.length})</span>
              {groups.map((g) => {
                const isSelected = selectedGroup?.id === g.id;
                const isMember = g.memberIds.includes(currentUser.id);
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      soundEffects.playClick();
                      setSelectedGroup(g);
                      if (!isMember) {
                        messagingService.joinGroup(g.id, currentUser.id);
                        loadData();
                      }
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-800 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <strong className="block font-black truncate">{g.name}</strong>
                    <span className="text-[10px] opacity-80 block truncate">{g.description}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full inline-block mt-1 font-bold ${
                      isSelected ? 'bg-blue-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {g.memberIds.length} members {isMember ? '• Joined' : '• Click to Join'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right: Selected Group Messages */}
            <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
              {!selectedGroup ? (
                <div className="flex-1 p-8 text-center text-slate-500 font-bold flex flex-col items-center justify-center space-y-2">
                  <MessagesSquare className="w-10 h-10 text-blue-600" />
                  <h3 className="text-base font-black text-slate-900">Select an English Practice Group</h3>
                  <p className="text-xs text-slate-600">Choose from the educational groups on the left to join conversations.</p>
                </div>
              ) : (
                <>
                  <div className="p-3 px-6 bg-white border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 text-sm font-black">{selectedGroup.name}</strong>
                      <p className="text-[10px] text-slate-500">{selectedGroup.description}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-900">
                      Moderated by {selectedGroup.createdByName}
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3">
                    {groupMessages.length === 0 ? (
                      <div className="p-6 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200 text-xs">
                        No messages yet in this group. Be the first to share your English practice!
                      </div>
                    ) : (
                      groupMessages.map((gm) => {
                        const isMe = gm.senderId === currentUser.id;
                        const isPlaying = playingAudioId === gm.id;
                        return (
                          <div key={gm.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                            <span className="text-[10px] text-slate-400 font-bold px-1">
                              {gm.senderName} {gm.senderRole === 'teacher' ? '• 🎓 Teacher' : ''} • {new Date(gm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs md:text-sm shadow-2xs ${
                              gm.isAnnouncement
                                ? 'bg-amber-100 text-amber-950 border-2 border-amber-300 font-bold'
                                : isMe
                                ? 'bg-blue-700 text-white rounded-br-none'
                                : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                            }`}>
                              {gm.text && <p className="font-medium whitespace-pre-wrap">{gm.text}</p>}
                              {gm.audioUrl && (
                                <div className="pt-2">
                                  <button
                                    onClick={() => handleTogglePlay(gm.id, gm.audioUrl!)}
                                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                                      isMe ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'
                                    }`}
                                  >
                                    {isPlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                                    <span>{isPlaying ? 'Stop' : `Play Voice Note (${gm.durationSeconds || 3}s)`}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Group Voice Drawer */}
                  {(isRecording || recordedAudioUri) && (
                    <div className="p-3 bg-purple-50 border-t border-purple-200 flex items-center justify-between gap-2">
                      <span className="text-xs font-black text-purple-950">
                        {isRecording ? `Recording (${recordDuration}s)...` : `Group Voice Note ready`}
                      </span>
                      <div className="flex items-center gap-2">
                        {isRecording ? (
                          <button onClick={handleStopRecording} className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs">
                            Stop
                          </button>
                        ) : (
                          <>
                            <button onClick={() => handleTogglePlay('prev-grp', recordedAudioUri!)} className="px-3 py-1.5 rounded-xl bg-purple-200 text-purple-900 font-bold text-xs">
                              {playingAudioId === 'prev-grp' ? 'Stop' : 'Listen'}
                            </button>
                            <button onClick={handleDeleteRecording} className="p-1.5 text-rose-600">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={handleSendGroupVoice} className="px-4 py-1.5 rounded-xl bg-blue-700 text-white font-black text-xs flex items-center gap-1">
                              <Send className="w-3 h-3" /> Post Voice Note
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Group Input Bar */}
                  <form onSubmit={handleSendGroupText} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                    {!isRecording && !recordedAudioUri && (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                        title="Record voice note for group"
                      >
                        <Mic className="w-4 h-4" />
                      </button>
                    )}
                    <input
                      type="text"
                      placeholder={`Post in ${selectedGroup.name}...`}
                      value={groupInputText}
                      onChange={(e) => setGroupInputText(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                    <button
                      type="submit"
                      disabled={!groupInputText.trim()}
                      className="p-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
