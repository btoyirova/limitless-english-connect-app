import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  RotateCcw, 
  Volume2, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  CheckCheck, 
  Repeat, 
  HelpCircle,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { User, VoiceMessage } from '../types';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { AudioRecorder, RecordResult } from '../services/audioRecorder';
import { storage } from '../services/storage';

interface VoiceMessagesViewProps {
  currentUser: User;
  partner: User | null;
  onOpenReport: (user: User) => void;
  onOpenCall: () => void;
}

export const VoiceMessagesView: React.FC<VoiceMessagesViewProps> = ({
  currentUser,
  partner,
  onOpenReport,
  onOpenCall
}) => {
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedResult, setRecordedResult] = useState<RecordResult | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0); // 1.0 or 0.8 for slow beginner listening
  const [showTranscripts, setShowTranscripts] = useState<boolean>(true);

  const recorderRef = useRef<AudioRecorder>(new AudioRecorder());
  const timerRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Load conversation messages
  const loadMessages = () => {
    if (partner) {
      const msgs = storage.getMessagesForPair(currentUser.id, partner.id);
      setMessages(msgs);
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [currentUser.id, partner?.id]);

  // Handle global keyboard shortcut Spacebar / Alt+R to record
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' && e.target === document.body) || (e.altKey && e.key.toLowerCase() === 'r')) {
        e.preventDefault();
        if (isRecording) {
          handleStopRecording();
        } else if (!recordedResult && partner) {
          handleStartRecording();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRecording, recordedResult, partner]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewProgress, setPreviewProgress] = useState(0);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  // Recording controls
  const handleStartRecording = async () => {
    if (!partner) return;
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setActivePlayingId(null);
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    setPreviewProgress(0);
    setRecordedResult(null);
    setErrorMessage(null);
    setRecordingSeconds(0);

    try {
      setIsRecording(true);
      speechService.announce('Recording started. Speak clearly now.');

      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      await recorderRef.current.startRecording();
    } catch (err) {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const msg = err instanceof Error ? err.message : 'Unable to access microphone.';
      setErrorMessage(msg);
      soundEffects.playWarning();
      speechService.announce(`Microphone error: ${msg}`);
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    try {
      const result = await recorderRef.current.stopRecording();
      setIsRecording(false);
      setRecordedResult(result);
      setErrorMessage(null);
      speechService.announce(`Recording stopped. Your message is ${result.durationSeconds} seconds. You can preview, re-record, or send.`);
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

    if (!previewAudioRef.current) {
      const audio = new Audio(recordedResult.audioUrl);
      previewAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingPreview(false);
        setPreviewProgress(0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration && audio.duration > 0) {
          setPreviewProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      audio.onerror = () => {
        setIsPlayingPreview(false);
        setErrorMessage('Unable to play back recorded audio preview.');
      };
    }

    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      soundEffects.playClick();
      previewAudioRef.current.play().then(() => {
        setIsPlayingPreview(true);
      }).catch(() => {
        setIsPlayingPreview(false);
      });
    }
  };

  const handleResetRecording = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
    }
    setIsPlayingPreview(false);
    setPreviewProgress(0);
    setRecordedResult(null);
    setErrorMessage(null);
  };

  const handleSendVoiceMessage = () => {
    if (!recordedResult || !partner) return;
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      previewAudioRef.current = null;
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
      transcript: `[Voice note from ${currentUser.name} (${recordedResult.durationSeconds}s)]`
    });

    handleResetRecording();
    loadMessages();
    speechService.announce(`Voice message sent to ${partner.name}!`);
  };

  // Audio Playback
  const handlePlayMessage = (msg: VoiceMessage) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }

    if (activePlayingId === msg.id) {
      setActivePlayingId(null);
      setPlaybackProgress(0);
      return;
    }

    soundEffects.playClick();
    const audio = new Audio(msg.audioUrl);
    audio.playbackRate = playbackRate;
    audioElementRef.current = audio;

    audio.onended = () => {
      setActivePlayingId(null);
      setPlaybackProgress(0);
      storage.markMessageAsListened(msg.id);
      loadMessages();
    };

    audio.ontimeupdate = () => {
      if (audio.duration) {
        setPlaybackProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.play().then(() => {
      setActivePlayingId(msg.id);
      speechService.announce(`Playing message from ${msg.senderName}`);
    }).catch(() => {
      // Audio playback interrupted
    });
  };

  const handleCycleSpeed = () => {
    soundEffects.playClick();
    const newRate = playbackRate === 1.0 ? 0.8 : 1.0;
    setPlaybackRate(newRate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = newRate;
    }
    speechService.announce(`Playback speed changed to ${newRate === 0.8 ? 'Slow 0.8x for beginner learners' : 'Normal 1.0x'}`);
  };

  const handleReadTranscriptAloud = (transcript: string, senderName: string) => {
    soundEffects.playClick();
    speechService.speak(`${senderName} said: ${transcript}`, true);
  };

  if (!currentUser.isApproved) {
    return (
      <div className="bg-white rounded-3xl p-8 border-4 border-amber-400 shadow-xl space-y-4 text-center max-w-2xl mx-auto my-8 animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">
            Account Awaiting Teacher Approval
          </h1>
          <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
            For child and learner safety, voice messaging with peers is locked until your teacher reviews your registration and assigns a vetted speaking partner in your age cohort.
          </p>
        </div>
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs font-bold text-amber-950 max-w-sm mx-auto">
          You can still practice solo speaking using the 5 Conversation Topics!
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Conversation Partner Banner */}
      <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {partner ? (
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${partner.avatarColor} text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-white shrink-0`}>
              {partner.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 leading-tight">
                  {partner.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Verified Partner
                </span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 font-semibold mt-0.5">
                {partner.ageGroup.toUpperCase()} Learner • Native Language: {partner.nativeLanguage || 'Beginner'}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-black text-slate-900">Voice Messaging Hub</h1>
            <p className="text-sm text-slate-600">Awaiting your teacher-approved speaking partner.</p>
          </div>
        )}

        {/* Action buttons: Live Call & Safety Report */}
        {partner && (
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenCall}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs focus:ring-4 focus:ring-emerald-400"
              aria-label={`Call ${partner.name} for live conversation`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Now</span>
            </button>

            <button
              onClick={() => onOpenReport(partner)}
              className="px-3.5 py-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 font-bold text-xs flex items-center gap-1.5 focus:ring-4 focus:ring-rose-400"
              aria-label={`Report safety issue regarding ${partner.name}`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Report</span>
            </button>
          </div>
        )}
      </div>

      {/* Primary Voice Recorder Deck */}
      <section 
        className="bg-white rounded-3xl p-6 md:p-8 border-4 border-blue-600 shadow-xl space-y-6"
        aria-labelledby="record-deck-heading"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 id="record-deck-heading" className="text-xl md:text-2xl font-black text-slate-900">
              Record a Voice Message
            </h2>
            <p className="text-xs md:text-sm text-slate-600 font-medium">
              No typing needed! Press the big button or hit Spacebar to start.
            </p>
          </div>

          {/* Playback speed toggle for accessibility */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCycleSpeed}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs border border-slate-300 focus:ring-4 focus:ring-blue-400"
              aria-label={`Current playback speed is ${playbackRate}x. Press to toggle between normal and slow learner speed.`}
            >
              Speed: {playbackRate === 1.0 ? '1.0x (Normal)' : '0.8x (Learner Slow)'}
            </button>
          </div>
        </div>

        {/* Error message alert */}
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

        {/* Central Big Tactile Recording Action */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          {!isRecording && !recordedResult && (
            <div className="space-y-4">
              <button
                onClick={handleStartRecording}
                disabled={!partner}
                className="w-28 h-28 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-2xl border-4 border-white ring-8 ring-rose-200 active:scale-95 transition-all mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Start recording voice message. Shortcut: Space or Alt R"
              >
                <Mic className="w-12 h-12" />
              </button>
              <div>
                <span className="block text-xl font-black text-slate-900">
                  {partner ? 'Press to Record' : 'No partner assigned'}
                </span>
                <span className="block text-xs font-semibold text-slate-500 mt-0.5">
                  Spacebar or Alt + R
                </span>
              </div>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              <button
                onClick={handleStopRecording}
                className="w-28 h-28 rounded-full bg-rose-700 text-white flex items-center justify-center shadow-2xl border-4 border-white ring-8 ring-rose-300 animate-pulse active:scale-95 transition-all mx-auto"
                aria-label="Stop recording voice message"
              >
                <Square className="w-12 h-12 fill-current" />
              </button>

              <div className="space-y-2">
                <span className="block text-2xl font-black text-rose-700">
                  Recording... 0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds}
                </span>

                {/* Animated Waveform */}
                <div className="flex items-center justify-center gap-1.5 h-10">
                  <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-1" />
                  <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-2" />
                  <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-3" />
                  <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-4" />
                  <div className="w-2 bg-rose-500 rounded-full animate-audio-bar-5" />
                </div>

                <span className="block text-xs font-bold text-slate-600">
                  Click the square button or hit Spacebar to finish
                </span>
              </div>
            </div>
          )}

          {/* Recorded Preview & Send Deck */}
          {recordedResult && (
            <div className="w-full max-w-md space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-400 flex items-center justify-between gap-4">
                <button
                  onClick={handleTogglePlayPreview}
                  className="w-12 h-12 rounded-xl bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shrink-0 focus:ring-4 focus:ring-blue-400"
                  aria-label={isPlayingPreview ? 'Pause playback of recorded message' : 'Play back recorded voice message preview'}
                >
                  {isPlayingPreview ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                <div className="flex-1 text-left">
                  <span className="block text-xs font-bold text-blue-900">
                    Voice Message Ready
                  </span>
                  <span className="block text-sm font-extrabold text-slate-900">
                    Duration: {recordedResult.durationSeconds}s
                  </span>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden mt-1.5">
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
                  className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                  aria-label="Delete and re-record message"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetRecording}
                  className="flex-1 py-3 px-4 rounded-xl border-2 border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
                >
                  Re-record
                </button>

                <button
                  onClick={handleSendVoiceMessage}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black flex items-center justify-center gap-2 shadow-lg focus:ring-4 focus:ring-blue-500"
                  aria-label={`Send voice message to ${partner?.name}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send to {partner?.name}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Voice Messages Conversation Feed */}
      <section 
        className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-200 shadow-md space-y-4"
        aria-labelledby="feed-heading"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 id="feed-heading" className="text-xl font-black text-slate-900">
            Voice Conversation Thread ({messages.length})
          </h2>

          <button
            onClick={() => setShowTranscripts(!showTranscripts)}
            className="text-xs font-bold text-blue-700 hover:underline"
          >
            {showTranscripts ? 'Hide Accessible Transcripts' : 'Show Accessible Transcripts'}
          </button>
        </div>

        {messages.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Sparkles className="w-10 h-10 mx-auto text-blue-400" />
            <p className="font-extrabold text-base text-slate-800">No voice messages yet!</p>
            <p className="text-xs">Record your first message above to say hello to {partner?.name || 'your partner'}.</p>
          </div>
        ) : (
          <div className="space-y-4" role="feed" aria-label="Voice message history">
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              const isPlaying = activePlayingId === msg.id;

              return (
                <article
                  key={msg.id}
                  className={`p-5 rounded-3xl border-2 transition-all ${
                    isMine
                      ? 'bg-blue-50/60 border-blue-200 ml-auto max-w-xl'
                      : 'bg-white border-slate-200 mr-auto max-w-xl shadow-xs'
                  }`}
                  aria-label={`Voice message from ${msg.senderName}, duration ${msg.durationSeconds} seconds`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                      {isMine ? 'You (Sent)' : `${msg.senderName} (Received)`}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Accessible Player Bar */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handlePlayMessage(msg)}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shrink-0 transition-transform active:scale-95 shadow-md focus:ring-4 ${
                        isPlaying
                          ? 'bg-amber-600 ring-4 ring-amber-300'
                          : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-400'
                      }`}
                      aria-label={isPlaying ? `Pause message from ${msg.senderName}` : `Play voice message from ${msg.senderName}`}
                    >
                      {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-0.5" />}
                    </button>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Audio Message</span>
                        <span>{msg.durationSeconds}s</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full transition-all"
                          style={{ width: `${isPlaying ? playbackProgress : 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Repeat audio button */}
                    <button
                      onClick={() => handlePlayMessage(msg)}
                      className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-200 focus:ring-2 focus:ring-blue-400"
                      aria-label={`Repeat message from ${msg.senderName}`}
                      title="Repeat Audio"
                    >
                      <Repeat className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Accessible Spoken / Text Transcript */}
                  {showTranscripts && msg.transcript && (
                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-start justify-between gap-3 text-xs md:text-sm text-slate-800">
                      <p className="italic leading-relaxed font-medium">
                        "{msg.transcript}"
                      </p>
                      <button
                        onClick={() => handleReadTranscriptAloud(msg.transcript!, msg.senderName)}
                        className="p-1.5 rounded-lg text-blue-700 hover:bg-blue-100 shrink-0"
                        aria-label={`Read transcript from ${msg.senderName} aloud`}
                        title="Read transcript aloud"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
