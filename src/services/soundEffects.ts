// Web Audio API Sound Effects (Earcons) for blind and low-vision auditory feedback
class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private ringtoneInterval: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Play a simple frequency beep with smooth gain envelope
  playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainLevel = 0.15) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(gainLevel, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext may be restricted by browser before user interaction
    }
  }

  // Warning or blocked action tone
  playWarning() {
    this.playTone(280, 0.25, 'sawtooth', 0.15);
  }

  // Recording Started Sound (cheerful rising chime)
  playRecordStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [440, 659.25, 880].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.12, 'sine', 0.18);
      }, i * 65);
    });
  }

  // Recording Stopped Sound (warm descending chime)
  playRecordStop() {
    [880, 659.25, 440].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.14, 'sine', 0.16);
      }, i * 70);
    });
  }

  // Message Sent Sound (uplifting celebratory chord)
  playMessageSent() {
    const ctx = this.getContext();
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'triangle', 0.18);
      }, i * 60);
    });
  }

  // Button Tap / Feedback
  playClick() {
    this.playTone(600, 0.05, 'sine', 0.08);
  }

  // Action Success / Confirmation
  playSuccess() {
    [587.33, 880].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.18, 'sine', 0.16);
      }, i * 110);
    });
  }

  // Start Phone Call Ringing
  startRingtone() {
    this.stopRingtone();
    const playRingCycle = () => {
      this.playTone(440, 0.4, 'sine', 0.2);
      setTimeout(() => this.playTone(480, 0.4, 'sine', 0.2), 100);
      setTimeout(() => {
        this.playTone(440, 0.4, 'sine', 0.2);
      }, 700);
      setTimeout(() => {
        this.playTone(480, 0.4, 'sine', 0.2), 800;
      }, 800);
    };

    playRingCycle();
    this.ringtoneInterval = window.setInterval(playRingCycle, 2800);
  }

  stopRingtone() {
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  // Call Connected (joyful double ding)
  playCallConnected() {
    this.stopRingtone();
    [523.25, 659.25, 1046.5].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.35, 'sine', 0.22);
      }, i * 100);
    });
  }

  // Call Ended
  playCallEnded() {
    this.stopRingtone();
    [659.25, 440, 329.63].forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'sine', 0.18);
      }, i * 120);
    });
  }
}

export const soundEffects = new SoundEffectsService();
