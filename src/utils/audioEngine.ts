// Audio Engine managing Web Audio API, DSP effects, and Visualizer Analyser

export interface AudioFXConfig {
  preset: 'flat' | 'warm' | 'podcast' | 'radio' | 'reverb';
  gain: number; // 0 to 2 (1 = 100%)
  playbackRate: number; // 0.5 to 2.0
}

export class StudioAudioEngine {
  private ctx: AudioContext | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private analyserNode: AnalyserNode | null = null;
  private filterLow: BiquadFilterNode | null = null;
  private filterHigh: BiquadFilterNode | null = null;
  private filterMid: BiquadFilterNode | null = null;
  private currentBuffer: AudioBuffer | null = null;

  private startTime: number = 0;
  private pauseOffset: number = 0;
  private isPlaying: boolean = false;
  private onEndedCallback: (() => void) | null = null;

  constructor() {
    // Lazy initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getContext(): AudioContext {
    this.initContext();
    return this.ctx!;
  }

  public getAnalyser(): AnalyserNode {
    this.initContext();
    if (!this.analyserNode) {
      this.analyserNode = this.ctx!.createAnalyser();
      this.analyserNode.fftSize = 256;
      this.analyserNode.smoothingTimeConstant = 0.8;
    }
    return this.analyserNode;
  }

  public async loadAudioFromBase64(wavBase64: string): Promise<AudioBuffer> {
    this.initContext();
    const binary = atob(wavBase64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const audioBuffer = await this.ctx!.decodeAudioData(bytes.buffer);
    this.currentBuffer = audioBuffer;
    this.pauseOffset = 0;
    return audioBuffer;
  }

  public play(
    offset = 0,
    fx: AudioFXConfig = { preset: 'flat', gain: 1, playbackRate: 1 },
    onEnded?: () => void
  ) {
    this.initContext();
    if (!this.currentBuffer) return;

    this.stop();

    const ctx = this.ctx!;
    this.sourceNode = ctx.createBufferSource();
    this.sourceNode.buffer = this.currentBuffer;
    this.sourceNode.playbackRate.value = fx.playbackRate || 1;

    // Filters for DSP FX
    this.filterLow = ctx.createBiquadFilter();
    this.filterMid = ctx.createBiquadFilter();
    this.filterHigh = ctx.createBiquadFilter();
    this.applyFXPreset(fx.preset);

    this.gainNode = ctx.createGain();
    this.gainNode.gain.value = fx.gain;

    this.analyserNode = this.getAnalyser();

    // Routing graph: source -> filterLow -> filterMid -> filterHigh -> gain -> analyser -> destination
    this.sourceNode.connect(this.filterLow);
    this.filterLow.connect(this.filterMid);
    this.filterMid.connect(this.filterHigh);
    this.filterHigh.connect(this.gainNode);
    this.gainNode.connect(this.analyserNode);
    this.analyserNode.connect(ctx.destination);

    this.onEndedCallback = onEnded || null;
    this.sourceNode.onended = () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pauseOffset = 0;
        if (this.onEndedCallback) this.onEndedCallback();
      }
    };

    const startOffset = Math.max(0, Math.min(offset, this.currentBuffer.duration));
    this.sourceNode.start(0, startOffset);
    this.startTime = ctx.currentTime - startOffset / (fx.playbackRate || 1);
    this.pauseOffset = startOffset;
    this.isPlaying = true;
  }

  public pause(): number {
    if (!this.isPlaying || !this.ctx) return this.pauseOffset;
    const current = this.getCurrentTime();
    this.pauseOffset = current;
    this.stop();
    return this.pauseOffset;
  }

  public stop() {
    if (this.sourceNode) {
      try {
        this.sourceNode.onended = null;
        this.sourceNode.stop();
        this.sourceNode.disconnect();
      } catch (e) {
        // already stopped
      }
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  public getCurrentTime(): number {
    if (!this.isPlaying || !this.ctx || !this.currentBuffer) {
      return this.pauseOffset;
    }
    const elapsed = (this.ctx.currentTime - this.startTime) * (this.sourceNode?.playbackRate.value || 1);
    return Math.min(Math.max(0, elapsed), this.currentBuffer.duration);
  }

  public getDuration(): number {
    return this.currentBuffer ? this.currentBuffer.duration : 0;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setGain(value: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(value, this.ctx.currentTime, 0.05);
    }
  }

  public setPlaybackRate(rate: number) {
    if (this.sourceNode && this.ctx) {
      this.sourceNode.playbackRate.setTargetAtTime(rate, this.ctx.currentTime, 0.05);
    }
  }

  public applyFXPreset(preset: AudioFXConfig['preset']) {
    if (!this.filterLow || !this.filterMid || !this.filterHigh) return;

    if (preset === 'flat') {
      this.filterLow.type = 'allpass';
      this.filterMid.type = 'allpass';
      this.filterHigh.type = 'allpass';
    } else if (preset === 'warm') {
      // Warm broadcast: boost 180Hz shelf, gentle high cut
      this.filterLow.type = 'lowshelf';
      this.filterLow.frequency.value = 220;
      this.filterLow.gain.value = 4.5;

      this.filterMid.type = 'peaking';
      this.filterMid.frequency.value = 1000;
      this.filterMid.gain.value = 0;

      this.filterHigh.type = 'highshelf';
      this.filterHigh.frequency.value = 5000;
      this.filterHigh.gain.value = 1.5;
    } else if (preset === 'podcast') {
      // Podcast Punch: vocal presence boost around 3kHz, low cut rumble
      this.filterLow.type = 'highpass';
      this.filterLow.frequency.value = 85;

      this.filterMid.type = 'peaking';
      this.filterMid.frequency.value = 2800;
      this.filterMid.Q.value = 1.2;
      this.filterMid.gain.value = 3.5;

      this.filterHigh.type = 'highshelf';
      this.filterHigh.frequency.value = 8000;
      this.filterHigh.gain.value = 2.0;
    } else if (preset === 'radio') {
      // Vintage AM / telephone bandpass
      this.filterLow.type = 'highpass';
      this.filterLow.frequency.value = 450;

      this.filterMid.type = 'peaking';
      this.filterMid.frequency.value = 1800;
      this.filterMid.Q.value = 2;
      this.filterMid.gain.value = 5;

      this.filterHigh.type = 'lowpass';
      this.filterHigh.frequency.value = 3200;
    } else if (preset === 'reverb') {
      // Subtle chamber air boost
      this.filterLow.type = 'lowshelf';
      this.filterLow.frequency.value = 200;
      this.filterLow.gain.value = 2;

      this.filterMid.type = 'peaking';
      this.filterMid.frequency.value = 3500;
      this.filterMid.gain.value = 2.5;

      this.filterHigh.type = 'highshelf';
      this.filterHigh.frequency.value = 10000;
      this.filterHigh.gain.value = 3.5;
    }
  }
}

export const studioAudio = new StudioAudioEngine();
