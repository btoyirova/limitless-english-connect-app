import React, { useState, useEffect } from 'react';
import { Volume2, Square, Sparkles, Check, X, Sliders, Headphones } from 'lucide-react';
import { speechService, VoiceMode, SpeechSpeed } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({ isOpen, onClose }) => {
  const [currentPrefs, setCurrentPrefs] = useState(speechService.getPreferences());
  const [isTestSpeaking, setIsTestSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPrefs(speechService.getPreferences());
    }
  }, [isOpen]);

  useEffect(() => {
    const unsub = speechService.subscribe((isSpeaking, _, id) => {
      setIsTestSpeaking(isSpeaking && id === 'test-audio-voice');
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const handleVoiceChange = (mode: VoiceMode) => {
    soundEffects.playClick();
    const updated = { ...currentPrefs, voiceMode: mode };
    setCurrentPrefs(updated);
    speechService.savePreferences(updated);
  };

  const handleSpeedChange = (speed: SpeechSpeed) => {
    soundEffects.playClick();
    const updated = { ...currentPrefs, speed };
    setCurrentPrefs(updated);
    speechService.savePreferences(updated);
  };

  const handleVolumeChange = (vol: number) => {
    soundEffects.playClick();
    const updated = { ...currentPrefs, volume: vol };
    setCurrentPrefs(updated);
    speechService.savePreferences(updated);
  };

  const handleTestVoiceToggle = () => {
    soundEffects.playClick();
    const sampleText =
      currentPrefs.voiceMode === 'gentle-1'
        ? 'Hello! This is Gentle Voice 1. Welcome to Limitless English Connect. You can practice speaking English with confidence!'
        : 'Hello! This is Gentle Voice 2. Welcome to Limitless English Connect. Let us practice English together!';
    speechService.toggleSpeak('test-audio-voice', sampleText);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-settings-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          speechService.stop();
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-blue-500 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h2 id="audio-settings-title" className="text-2xl font-black text-slate-900">
                Audio & Voice Settings
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Customize natural English voice, speed, and volume for comfortable learning.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              speechService.stop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:ring-4 focus:ring-blue-400 cursor-pointer"
            aria-label="Close audio settings dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Voice Choice */}
        <div className="space-y-3">
          <label className="text-sm font-black text-slate-900 block">
            1. Select Natural English Voice
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="English voice selection">
            <button
              type="button"
              role="radio"
              aria-checked={currentPrefs.voiceMode === 'gentle-1'}
              onClick={() => handleVoiceChange('gentle-1')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                currentPrefs.voiceMode === 'gentle-1'
                  ? 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs ring-2 ring-blue-400'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Gentle Voice 1</span>
                {currentPrefs.voiceMode === 'gentle-1' && <Check className="w-4 h-4 text-blue-700" />}
              </div>
              <span className="text-xs text-slate-500 block mt-1 font-medium">
                Warm, clear female tone
              </span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={currentPrefs.voiceMode === 'gentle-2'}
              onClick={() => handleVoiceChange('gentle-2')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                currentPrefs.voiceMode === 'gentle-2'
                  ? 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs ring-2 ring-blue-400'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">Gentle Voice 2</span>
                {currentPrefs.voiceMode === 'gentle-2' && <Check className="w-4 h-4 text-blue-700" />}
              </div>
              <span className="text-xs text-slate-500 block mt-1 font-medium">
                Clear, friendly male tone
              </span>
            </button>
          </div>
        </div>

        {/* 2. Speaking Speed */}
        <div className="space-y-3">
          <label className="text-sm font-black text-slate-900 block">
            2. Speaking Pace for Beginners
          </label>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Speaking pace selection">
            <button
              type="button"
              role="radio"
              aria-checked={currentPrefs.speed === 'normal'}
              onClick={() => handleSpeedChange('normal')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                currentPrefs.speed === 'normal'
                  ? 'border-blue-600 bg-blue-50 text-blue-950 font-black ring-2 ring-blue-400'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold'
              }`}
            >
              <span className="text-sm block">Normal (0.88x)</span>
              <span className="text-[11px] text-slate-500 font-medium">Recommended beginner pace</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={currentPrefs.speed === 'slow'}
              onClick={() => handleSpeedChange('slow')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                currentPrefs.speed === 'slow'
                  ? 'border-blue-600 bg-blue-50 text-blue-950 font-black ring-2 ring-blue-400'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold'
              }`}
            >
              <span className="text-sm block">Slow (0.75x)</span>
              <span className="text-[11px] text-slate-500 font-medium">For extra clarity & repetition</span>
            </button>
          </div>
        </div>

        {/* 3. Comfortable Volume */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-black text-slate-900">
              3. Voice Volume Level
            </label>
            <span className="text-xs font-black text-blue-700">
              {Math.round(currentPrefs.volume * 100)}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0.7, 0.9, 1.0].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => handleVolumeChange(v)}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-black transition-all cursor-pointer ${
                  Math.abs(currentPrefs.volume - v) < 0.05
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {Math.round(v * 100)}% {v === 0.9 ? '(Comfortable)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Button with Toggle Play / Stop */}
        <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700 text-center sm:text-left">
            Press to preview the voice. Press again to stop.
          </span>
          <button
            type="button"
            onClick={handleTestVoiceToggle}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
              isTestSpeaking
                ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-200'
                : 'bg-blue-700 hover:bg-blue-800 text-white focus:ring-4 focus:ring-blue-300'
            }`}
            aria-label={isTestSpeaking ? 'Stop voice sample' : 'Listen to voice sample'}
          >
            {isTestSpeaking ? <Square className="w-4 h-4 fill-white" /> : <Volume2 className="w-4 h-4" />}
            <span>{isTestSpeaking ? 'Stop Playing' : 'Test Voice (Listen)'}</span>
          </button>
        </div>

        {/* Save & Close Button */}
        <button
          type="button"
          onClick={() => {
            speechService.stop();
            soundEffects.playSuccess();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md focus:ring-4 focus:ring-emerald-300 transition-all cursor-pointer"
        >
          Save & Apply Audio Settings
        </button>
      </div>
    </div>
  );
};
