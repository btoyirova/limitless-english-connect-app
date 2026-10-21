import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  HelpCircle, 
  Sparkles,
  PhoneCall,
  UserCheck
} from 'lucide-react';
import { User, ConversationTopic } from '../types';
import { soundEffects } from '../services/soundEffects';
import { speechService } from '../services/speechService';
import { storage } from '../services/storage';

interface LiveCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  partner: User | null;
  onOpenReport: (user: User) => void;
}

export const LiveCallModal: React.FC<LiveCallModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  partner,
  onOpenReport,
}) => {
  const [callState, setCallState] = useState<'connecting' | 'ringing' | 'connected' | 'ended'>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [partnerSpeaking, setPartnerSpeaking] = useState(false);
  const [showPromptsDrawer, setShowPromptsDrawer] = useState(true);
  const [topics, setTopics] = useState<ConversationTopic[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen && partner) {
      setTopics(storage.getTopics());
      setCallState('ringing');
      setCallDuration(0);
      soundEffects.startRingtone();
      speechService.announce(`Calling your speaking partner ${partner.name}. Ringing.`);

      // Simulate partner picking up after 2.8 seconds
      const connectTimer = window.setTimeout(() => {
        soundEffects.stopRingtone();
        soundEffects.playCallConnected();
        setCallState('connected');
        speechService.announce(`Connected to ${partner.name}. You can speak now.`);

        // Trigger greeting from partner
        window.setTimeout(() => {
          triggerPartnerSpeech(`Hello ${currentUser.name}! It is great to hear you. How are you today?`);
        }, 1200);
      }, 2800);

      return () => {
        clearTimeout(connectTimer);
        soundEffects.stopRingtone();
      };
    }
  }, [isOpen, partner]);

  // Duration timer
  useEffect(() => {
    if (callState === 'connected') {
      timerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen || !partner) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEndCall = () => {
    soundEffects.stopRingtone();
    soundEffects.playCallEnded();
    setCallState('ended');
    speechService.announce('Call ended.');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleToggleMute = () => {
    soundEffects.playClick();
    setIsMuted(!isMuted);
    speechService.announce(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const handleToggleSpeaker = () => {
    soundEffects.playClick();
    setSpeakerOn(!speakerOn);
    speechService.announce(speakerOn ? 'Speaker muted' : 'Speaker turned on');
  };

  const triggerPartnerSpeech = (text: string) => {
    setPartnerSpeaking(true);
    speechService.speak(text, true).then(() => {
      setPartnerSpeaking(false);
    });
  };

  const samplePartnerReplies = [
    `I am doing great! The weather here is sunny. What did you do today?`,
    `My favorite food is rice and fresh vegetables. What do you like to eat?`,
    `In my free time, I love listening to music. Do you play any instruments?`,
    `That sounds wonderful! Thank you for sharing with me.`
  ];

  const handleSimulatePartnerResponse = () => {
    soundEffects.playClick();
    const randomReply = samplePartnerReplies[Math.floor(Math.random() * samplePartnerReplies.length)];
    triggerPartnerSpeech(randomReply);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="call-partner-name"
    >
      <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border-4 border-blue-500 relative flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Call Header with Safety and Minimize */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Secure Learner Voice Call</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReport(partner)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/80 text-rose-300 border border-rose-700 hover:bg-rose-900 text-xs font-bold"
              aria-label="Report safety issue with this call"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Call Body */}
        <div className="py-6 flex flex-col items-center text-center">
          {/* Avatar with Sound Pulse Ring */}
          <div className="relative mb-4">
            <div
              className={`w-28 h-28 md:w-36 md:h-36 rounded-full ${partner.avatarColor} border-4 border-white flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-2xl transition-transform ${
                partnerSpeaking ? 'scale-110 ring-8 ring-blue-400/50' : 'ring-4 ring-blue-500/30'
              }`}
            >
              {partner.name.charAt(0)}
            </div>
            {callState === 'connected' && (
              <div className="absolute -bottom-2 bg-emerald-500 text-slate-950 px-3 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-md">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verified Partner</span>
              </div>
            )}
          </div>

          <h2 id="call-partner-name" className="text-2xl md:text-3xl font-black tracking-tight">
            {partner.name}
          </h2>
          <p className="text-blue-300 text-sm font-semibold mt-1">
            {partner.ageGroup.toUpperCase()} Learner • Native Language: {partner.nativeLanguage || 'English learner'}
          </p>

          {/* Call Status / Timer */}
          <div className="mt-4 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-sm font-bold flex items-center gap-2" role="status">
            {callState === 'ringing' && (
              <>
                <PhoneCall className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Ringing partner...</span>
              </>
            )}
            {callState === 'connected' && (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Connected • Call time: {formatTime(callDuration)}</span>
              </>
            )}
            {callState === 'ended' && <span>Call finished</span>}
          </div>

          {/* Live Waveform Indicator */}
          {callState === 'connected' && (
            <div className="flex items-center justify-center gap-1.5 h-12 my-4 px-6 py-2 rounded-2xl bg-slate-800/80 border border-slate-700" aria-label="Audio activity visualizer">
              <span className="text-xs text-blue-300 font-semibold mr-2">
                {partnerSpeaking ? `${partner.name} speaking:` : isMuted ? 'Your mic is muted' : 'Listening / Ready to talk'}
              </span>
              <div className={`w-1.5 bg-blue-400 rounded-full ${partnerSpeaking || !isMuted ? 'animate-audio-bar-1' : 'h-2'}`} />
              <div className={`w-1.5 bg-blue-400 rounded-full ${partnerSpeaking || !isMuted ? 'animate-audio-bar-2' : 'h-2'}`} />
              <div className={`w-1.5 bg-blue-400 rounded-full ${partnerSpeaking || !isMuted ? 'animate-audio-bar-3' : 'h-2'}`} />
              <div className={`w-1.5 bg-blue-400 rounded-full ${partnerSpeaking || !isMuted ? 'animate-audio-bar-4' : 'h-2'}`} />
              <div className={`w-1.5 bg-blue-400 rounded-full ${partnerSpeaking || !isMuted ? 'animate-audio-bar-5' : 'h-2'}`} />
            </div>
          )}
        </div>

        {/* Conversation Topic Prompts Helper (So learners never feel awkward or lost) */}
        {callState === 'connected' && (
          <div className="mb-6 rounded-2xl bg-slate-800/90 border-2 border-blue-500/40 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Speaking Prompts & Questions to Ask {partner.name}:</span>
              </div>
              <button
                onClick={() => setShowPromptsDrawer(!showPromptsDrawer)}
                className="text-xs text-blue-300 hover:text-white underline font-semibold"
              >
                {showPromptsDrawer ? 'Hide Prompts' : 'Show Prompts'}
              </button>
            </div>

            {showPromptsDrawer && (
              <div className="space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-left">
                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechService.speak('Prompt: Hello! What did you eat today, and what was your favorite dish?', true);
                    }}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs font-semibold text-white flex items-center justify-between group focus:ring-4 focus:ring-amber-400"
                    aria-label="Ask about favorite food prompt"
                  >
                    <span>"What is your favorite food to eat?"</span>
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  </button>

                  <button
                    onClick={() => {
                      soundEffects.playClick();
                      speechService.speak('Prompt: What do you like to do in your free time or for fun?', true);
                    }}
                    className="p-3 rounded-xl bg-slate-700 hover:bg-slate-600 border border-slate-600 text-xs font-semibold text-white flex items-center justify-between group focus:ring-4 focus:ring-amber-400"
                    aria-label="Ask about hobbies prompt"
                  >
                    <span>"What do you like to do in your free time?"</span>
                    <Volume2 className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                  </button>
                </div>

                {/* Simulate partner response button for interactive testing */}
                <button
                  onClick={handleSimulatePartnerResponse}
                  disabled={partnerSpeaking}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  aria-label="Prompt partner to respond in English"
                >
                  <Volume2 className="w-4 h-4 text-white" />
                  <span>Prompt {partner.name} to Speak Back (Practice Dialogue)</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* In-Call Action Controls */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-center gap-4 flex-wrap">
          {/* Mute Button */}
          <button
            onClick={handleToggleMute}
            className={`p-4 rounded-2xl flex flex-col items-center gap-1 min-w-[80px] font-bold text-xs transition-colors border-2 ${
              isMuted
                ? 'bg-rose-900/80 border-rose-500 text-rose-200'
                : 'bg-slate-800 border-slate-600 text-slate-100 hover:bg-slate-700'
            }`}
            aria-label={isMuted ? 'Microphone is muted. Press to unmute.' : 'Microphone is active. Press to mute.'}
          >
            {isMuted ? <MicOff className="w-6 h-6 text-rose-400" /> : <Mic className="w-6 h-6 text-emerald-400" />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          {/* Speaker Button */}
          <button
            onClick={handleToggleSpeaker}
            className={`p-4 rounded-2xl flex flex-col items-center gap-1 min-w-[80px] font-bold text-xs transition-colors border-2 ${
              !speakerOn
                ? 'bg-slate-800 border-slate-600 text-slate-400'
                : 'bg-blue-900/60 border-blue-500 text-blue-200 hover:bg-blue-800'
            }`}
            aria-label={speakerOn ? 'Speaker is active. Press to mute speaker.' : 'Speaker is off. Press to turn on.'}
          >
            {speakerOn ? <Volume2 className="w-6 h-6 text-blue-400" /> : <VolumeX className="w-6 h-6" />}
            <span>Speaker</span>
          </button>

          {/* Big End Call Button */}
          <button
            onClick={handleEndCall}
            className="px-8 py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-base flex items-center gap-3 border-2 border-rose-400 shadow-xl focus:ring-4 focus:ring-rose-400 active:scale-95 transition-transform"
            aria-label="End call"
          >
            <PhoneOff className="w-6 h-6" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
