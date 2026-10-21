// Real Audio Recorder using Web MediaRecorder API with cross-browser audio MIME support
// Captures authentic microphone input, packages real audio chunks into Blobs, and provides playback URLs.
import { soundEffects } from './soundEffects';

export interface RecordResult {
  audioUrl: string;
  durationSeconds: number;
  blob: Blob;
  mimeType: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private startTime: number = 0;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private audioContext: AudioContext | null = null;

  /**
   * Selects the best audio MIME type supported by the current browser.
   */
  static getSupportedMimeType(): string {
    if (typeof MediaRecorder === 'undefined') return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/aac',
    ];
    for (const candidate of candidates) {
      if (MediaRecorder.isTypeSupported(candidate)) {
        return candidate;
      }
    }
    return '';
  }

  /**
   * Check if getUserMedia is supported in the current browser/environment.
   */
  async isMicAvailable(): Promise<boolean> {
    return Boolean(
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === 'function'
    );
  }

  /**
   * Starts real microphone recording.
   * Throws a descriptive error if microphone permission is denied or devices are unavailable.
   */
  async startRecording(onVolumeLevel?: (volume: number) => void): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone access is not supported by your current browser.');
    }

    // Reset recording chunks and active state
    this.audioChunks = [];
    this.startTime = Date.now();

    try {
      // 1. Request real microphone stream
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err: unknown) {
      const error = err as { name?: string; message?: string };
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        throw new Error('Microphone permission was denied. Please allow microphone access in your browser settings to record your voice.');
      } else if (error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError') {
        throw new Error('No microphone device was detected on your computer or device.');
      } else if (error?.name === 'NotReadableError' || error?.name === 'TrackStartError') {
        throw new Error('Your microphone is currently in use by another application or tab.');
      }
      throw new Error(error?.message || 'Unable to access your microphone.');
    }

    // Play recording chime upon successful access
    soundEffects.playRecordStart();

    // 2. Setup real Web Audio Analyser for live volume metering
    if (onVolumeLevel && this.stream) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.audioContext = new AudioCtx();
          if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume().catch(() => {});
          }
          const source = this.audioContext.createMediaStreamSource(this.stream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 128;
          this.analyser.smoothingTimeConstant = 0.4;
          source.connect(this.analyser);

          const bufferLength = this.analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateMeter = () => {
            if (this.analyser) {
              this.analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
              }
              const average = sum / bufferLength;
              const normalized = Math.min(100, Math.round((average / 128) * 100));
              onVolumeLevel(normalized);
              this.animFrameId = requestAnimationFrame(updateMeter);
            }
          };
          updateMeter();
        }
      } catch {
        // AudioContext metering is non-fatal; continue recording
      }
    }

    // 3. Initialize real MediaRecorder
    try {
      const mimeType = AudioRecorder.getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      this.mediaRecorder = new MediaRecorder(this.stream, options);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Collect audio chunks every 250ms for consistent buffer population
      this.mediaRecorder.start(250);
    } catch (err: unknown) {
      this.cleanupStream();
      const message = (err as Error)?.message || 'Failed to initialize audio recorder.';
      throw new Error(`Could not start recording: ${message}`);
    }
  }

  /**
   * Stops real recording, stops media tracks, combines audio chunks into a playable Blob,
   * and returns the Object URL.
   */
  async stopRecording(): Promise<RecordResult> {
    soundEffects.playRecordStop();
    const durationSeconds = Math.max(1, Math.round((Date.now() - this.startTime) / 1000));

    // Cancel analyser frames & audio context
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioContext) {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;

    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
      this.cleanupStream();
      throw new Error('Recording was not active. Please try recording again.');
    }

    return new Promise<RecordResult>((resolve, reject) => {
      const recorder = this.mediaRecorder!;

      recorder.onerror = (event: Event) => {
        this.cleanupStream();
        reject(new Error(`Recording error: ${(event as unknown as { error?: { message?: string } })?.error?.message || 'unknown'}`));
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || AudioRecorder.getSupportedMimeType() || 'audio/webm';
        this.cleanupStream();

        if (this.audioChunks.length === 0) {
          reject(new Error('No audio data was captured from your microphone. Please check your microphone input.'));
          return;
        }

        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);

        resolve({
          audioUrl,
          durationSeconds,
          blob: audioBlob,
          mimeType,
        });
      };

      try {
        recorder.stop();
      } catch (err) {
        this.cleanupStream();
        reject(err instanceof Error ? err : new Error('Failed to stop recording.'));
      }
    });
  }

  private cleanupStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      this.stream = null;
    }
  }
}
