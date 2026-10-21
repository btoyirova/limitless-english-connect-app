import React from 'react';
import { X, Keyboard, Volume2 } from 'lucide-react';
import { speechService } from '../services/speechService';
import { soundEffects } from '../services/soundEffects';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space or Alt + R', action: 'Start or Stop Voice Recording in messages' },
    { key: 'Alt + H', action: 'Go to Home Screen' },
    { key: 'Alt + T', action: 'Go to 5 Conversation Topics' },
    { key: 'Alt + M', action: 'Go to Voice Messages Hub' },
    { key: 'Alt + C', action: 'Open Live Audio Call with Speaking Partner' },
    { key: 'Alt + L', action: 'Toggle Spoken Audio Guidance on or off' },
    { key: 'Escape', action: 'Close dialogs or stop speaking voice' },
    { key: 'Tab / Shift + Tab', action: 'Navigate forward or backward between buttons and controls' }
  ];

  const handleReadAloud = () => {
    soundEffects.playClick();
    const text = "Keyboard Shortcuts: Space or Alt R to start or stop recording. Alt H for Home. Alt T for Topics. Alt M for Voice Messages. Alt C for Live Call. Alt L to toggle spoken guidance. Escape to close dialogs.";
    speechService.speak(text, true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-4 border-blue-600 relative">
        <div className="flex items-center justify-between gap-3 border-b-2 border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-100 text-blue-800">
              <Keyboard className="w-6 h-6" />
            </div>
            <div>
              <h2 id="shortcuts-title" className="text-xl font-black text-slate-900">
                Keyboard Shortcuts
              </h2>
              <p className="text-sm text-slate-600">Quick keys for hands-free and keyboard navigation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus:ring-4 focus:ring-blue-600"
            aria-label="Close shortcuts modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Read aloud button for blind/low-vision users */}
        <button
          onClick={handleReadAloud}
          className="w-full mb-4 py-3 px-4 rounded-xl bg-blue-50 border-2 border-blue-400 text-blue-900 font-extrabold flex items-center justify-center gap-2 hover:bg-blue-100 focus:ring-4 focus:ring-blue-600"
          aria-label="Read all keyboard shortcuts aloud"
        >
          <Volume2 className="w-5 h-5 text-blue-700" />
          <span>Listen to Shortcuts Aloud</span>
        </button>

        <ul className="space-y-3 mb-6" aria-label="List of shortcuts">
          {shortcuts.map((sc, i) => (
            <li 
              key={i} 
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200"
            >
              <span className="text-sm font-medium text-slate-800">{sc.action}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-bold bg-white text-blue-900 border-2 border-slate-300 rounded-md shadow-xs">
                {sc.key}
              </kbd>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-700 text-white font-extrabold hover:bg-blue-800 focus:ring-4 focus:ring-blue-600"
          >
            Done (Press Escape)
          </button>
        </div>
      </div>
    </div>
  );
};
