// Web Speech Synthesis service for accessible, natural English voice listening
// Strictly English-only speech output with warm, gentle, non-robotic voices.
// Uzbek audio synthesis is disabled while written Uzbek translations (lang="uz") are preserved for students and their own screen readers.

export type VoiceMode = 'gentle-1' | 'gentle-2';
export type SpeechSpeed = 'slow' | 'normal';

export interface AudioPreferences {
  voiceMode: VoiceMode;
  speed: SpeechSpeed;
  volume: number; // 0.1 to 1.0, default 0.9
}

type SpeakingListener = (isSpeaking: boolean, text: string, currentId: string | null) => void;

class SpeechService {
  private isSupported: boolean = false;
  private listeners: Set<SpeakingListener> = new Set();
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private currentlyPlayingId: string | null = null;
  private isCurrentlySpeaking: boolean = false;
  private audioGuidanceEnabled: boolean = true;
  private voicesLoaded: boolean = false;

  // Preferences
  private voiceMode: VoiceMode = 'gentle-1';
  private speechSpeed: SpeechSpeed = 'normal';
  private volume: number = 0.9; // 90% comfortable volume - avoids distortion

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      this.loadSavedPreferences();

      // Populate voices when ready
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voicesLoaded = true;
        };
      }
    }
  }

  private loadSavedPreferences() {
    try {
      const saved = localStorage.getItem('limitless_audio_settings');
      if (saved) {
        const parsed: Partial<AudioPreferences> = JSON.parse(saved);
        if (parsed.voiceMode === 'gentle-1' || parsed.voiceMode === 'gentle-2') {
          this.voiceMode = parsed.voiceMode;
        }
        if (parsed.speed === 'slow' || parsed.speed === 'normal') {
          this.speechSpeed = parsed.speed;
        }
        if (typeof parsed.volume === 'number' && parsed.volume >= 0.1 && parsed.volume <= 1.0) {
          this.volume = parsed.volume;
        }
      }
    } catch {
      // Use defaults
    }
  }

  savePreferences(prefs: Partial<AudioPreferences>) {
    if (prefs.voiceMode) this.voiceMode = prefs.voiceMode;
    if (prefs.speed) this.speechSpeed = prefs.speed;
    if (typeof prefs.volume === 'number') this.volume = Math.max(0.1, Math.min(1.0, prefs.volume));

    try {
      localStorage.setItem(
        'limitless_audio_settings',
        JSON.stringify({
          voiceMode: this.voiceMode,
          speed: this.speechSpeed,
          volume: this.volume
        })
      );
    } catch {
      // ignore
    }
  }

  getPreferences(): AudioPreferences {
    return {
      voiceMode: this.voiceMode,
      speed: this.speechSpeed,
      volume: this.volume
    };
  }

  isSpeechSupported(): boolean {
    return this.isSupported;
  }

  setAudioGuidance(enabled: boolean) {
    this.audioGuidanceEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  isAudioGuidanceEnabled(): boolean {
    return this.audioGuidanceEnabled;
  }

  subscribe(listener: SpeakingListener): () => void {
    this.listeners.add(listener);
    // Notify current state immediately
    listener(this.isCurrentlySpeaking, this.currentUtterance?.text || '', this.currentlyPlayingId);
    return () => this.listeners.delete(listener);
  }

  private notify(isSpeaking: boolean, text: string = '', id: string | null = null) {
    this.isCurrentlySpeaking = isSpeaking;
    this.listeners.forEach((cb) => cb(isSpeaking, text, id));
  }

  /**
   * Returns true if the specific audio item is currently speaking.
   */
  isPlaying(id?: string): boolean {
    if (!id) return this.isCurrentlySpeaking;
    return this.isCurrentlySpeaking && this.currentlyPlayingId === id;
  }

  getCurrentlyPlayingId(): string | null {
    return this.currentlyPlayingId;
  }

  /**
   * Selects the natural, warm English voice according to student preference.
   */
  private selectEnglishVoice(): SpeechSynthesisVoice | null {
    if (!this.isSupported) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (englishVoices.length === 0) return voices[0] || null;

    if (this.voiceMode === 'gentle-2') {
      // Gentle Voice 2: Warm, natural male voice
      const maleVoice = englishVoices.find((v) => {
        const name = v.name.toLowerCase();
        return (
          (name.includes('daniel') ||
            name.includes('guy') ||
            name.includes('david') ||
            name.includes('george') ||
            name.includes('oliver') ||
            name.includes('male') ||
            name.includes('uk english male')) &&
          !name.includes('female')
        );
      });
      if (maleVoice) return maleVoice;
    }

    // Gentle Voice 1 (default): Warm, natural female voice
    const femaleVoice = englishVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('samantha') ||
        name.includes('jenny') ||
        name.includes('google us english') ||
        name.includes('victoria') ||
        name.includes('karen') ||
        name.includes('natural') ||
        name.includes('female')
      );
    });

    if (femaleVoice) return femaleVoice;

    // Fallback: any en-US voice, then any English voice
    return englishVoices.find((v) => v.lang === 'en-US') || englishVoices[0];
  }

  /**
   * TOGGLE PLAY / STOP FUNCTIONALITY:
   * 1st press: Start speaking.
   * 2nd press (on same item): Immediately stop speaking!
   * 3rd press: Restart cleanly from beginning.
   * Returns true if playback was started, false if stopped.
   */
  toggleSpeak(id: string, text: string): boolean {
    if (!this.isSupported) return false;

    // If already playing THIS item -> STOP immediately
    if (this.isCurrentlySpeaking && this.currentlyPlayingId === id) {
      this.stop();
      return false;
    }

    // Stop any previous playing speech
    this.stop();

    // Start speaking new item
    this.speak(text, true, id);
    return true;
  }

  /**
   * Speaks English text with natural cadence, comfortable volume, and centralized cancellation.
   */
  speak(text: string, force = false, id: string | null = null): Promise<void> {
    if (!this.isSupported) return Promise.resolve();
    if (!this.audioGuidanceEnabled && !force) return Promise.resolve();

    // Cancel any previous utterance immediately
    this.stop();

    const cleanText = text.trim();
    if (!cleanText) return Promise.resolve();

    return new Promise((resolve) => {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.lang = 'en-US';

        // Speech rate: slightly slower for beginners
        utterance.rate = this.speechSpeed === 'slow' ? 0.75 : 0.88;
        utterance.pitch = 1.0;
        utterance.volume = this.volume;

        const voice = this.selectEnglishVoice();
        if (voice) {
          utterance.voice = voice;
        }

        const speakId = id || `speak-${Date.now()}`;
        this.currentlyPlayingId = speakId;
        this.currentUtterance = utterance;

        utterance.onstart = () => {
          this.notify(true, cleanText, speakId);
        };

        utterance.onend = () => {
          if (this.currentlyPlayingId === speakId) {
            this.currentlyPlayingId = null;
            this.currentUtterance = null;
            this.notify(false, '', null);
          }
          resolve();
        };

        utterance.onerror = (e) => {
          // If cancelled explicitly, clean up cleanly
          if (this.currentlyPlayingId === speakId) {
            this.currentlyPlayingId = null;
            this.currentUtterance = null;
            this.notify(false, '', null);
          }
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.currentlyPlayingId = null;
        this.currentUtterance = null;
        this.notify(false, '', null);
        resolve();
      }
    });
  }

  /**
   * Immediate, clean cancellation of any active speech.
   * Cancels window.speechSynthesis, resets utterance, and notifies all listeners.
   */
  stop() {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.currentUtterance = null;
    this.currentlyPlayingId = null;
    this.notify(false, '', null);
  }

  /**
   * Uzbek audio synthesis is deliberately disabled.
   * Written Uzbek translations remain visible and screen-reader accessible via lang="uz".
   */
  async speakUzbek(text: string, force = false): Promise<{ spoken: boolean; fallbackMessage?: string }> {
    // Disabled as requested: do not generate automatic robotic Uzbek speech.
    return {
      spoken: false,
      fallbackMessage: 'O‘zbekcha matn ekranda ko‘rsatilgan va ekran o‘quvchi (screen reader) dasturlari orqali eshittirilishi mumkin.',
    };
  }

  /**
   * Screen reader / UI announcement in natural English.
   * Only announces if audio guidance is enabled and no full lesson audio is currently playing.
   */
  announce(text: string) {
    if (this.audioGuidanceEnabled && !this.isCurrentlySpeaking) {
      this.speak(text, true);
    }
  }
}

export const speechService = new SpeechService();
