import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Volume2,
  Sliders,
  Download,
  Share2,
  Repeat,
  Radio,
  Check,
  Disc3,
  Gauge
} from 'lucide-react';
import { studioAudio, AudioFXConfig } from '../utils/audioEngine';
import { AudioVisualizer } from './AudioVisualizer';
import { SessionTake } from '../types/tts';
import { useLanguage } from '../i18n/LanguageContext';

interface MasterDeckProps {
  currentTake: SessionTake | null;
  onTakeUpdated?: (take: SessionTake) => void;
}

export function MasterDeck({ currentTake }: MasterDeckProps) {
  const { t, isArabic } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fx, setFx] = useState<AudioFXConfig>({
    preset: 'flat',
    gain: 1.0,
    playbackRate: 1.0,
  });
  const [isFxOpen, setIsFxOpen] = useState(false);

  const loopRef = useRef(loop);
  loopRef.current = loop;

  // Load new take when currentTake changes
  useEffect(() => {
    if (!currentTake?.audioWavBase64) return;

    let cancelled = false;
    studioAudio.stop();
    setIsPlaying(false);
    setCurrentTime(0);

    studioAudio.loadAudioFromBase64(currentTake.audioWavBase64).then((buf) => {
      if (!cancelled) {
        setDuration(buf.duration);
        handlePlay(0);
      }
    }).catch(err => {
      console.error('Failed to decode take audio buffer:', err);
    });

    return () => {
      cancelled = true;
      studioAudio.stop();
    };
  }, [currentTake?.id]);

  // Animation timer for current playhead position
  useEffect(() => {
    let animId: number;
    const tick = () => {
      if (isPlaying) {
        const time = studioAudio.getCurrentTime();
        setCurrentTime(time);
      }
      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handlePlay = (startOffset?: number) => {
    if (!currentTake?.audioWavBase64) return;
    const offset = typeof startOffset === 'number' ? startOffset : currentTime;

    studioAudio.play(offset, fx, () => {
      if (loopRef.current) {
        handlePlay(0);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });
    setIsPlaying(true);
  };

  const handlePause = () => {
    const pausedAt = studioAudio.pause();
    setCurrentTime(pausedAt);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      if (currentTime >= duration - 0.05) {
        handlePlay(0);
      } else {
        handlePlay();
      }
    }
  };

  const handleRestart = () => {
    handlePlay(0);
  };

  const handleSeekRelative = (seconds: number) => {
    const target = Math.max(0, Math.min(currentTime + seconds, duration));
    setCurrentTime(target);
    if (isPlaying) {
      handlePlay(target);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = parseFloat(e.target.value);
    setCurrentTime(target);
    if (isPlaying) {
      handlePlay(target);
    }
  };

  const handleFXChange = (preset: AudioFXConfig['preset']) => {
    const newFx = { ...fx, preset };
    setFx(newFx);
    studioAudio.applyFXPreset(preset);
  };

  const handleGainChange = (gain: number) => {
    setFx((prev) => ({ ...prev, gain }));
    studioAudio.setGain(gain);
  };

  const handleSpeedChange = (speed: number) => {
    setFx((prev) => ({ ...prev, playbackRate: speed }));
    studioAudio.setPlaybackRate(speed);
    if (isPlaying) {
      handlePlay(currentTime);
    }
  };

  const handleDownloadWav = () => {
    if (!currentTake?.audioWavBase64) return;
    const byteCharacters = atob(currentTake.audioWavBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeTitle = currentTake.title.replace(/[^\p{L}\p{N}]/gu, '-').slice(0, 40) || 'voxstudio-audio';
    a.download = `${safeTitle}-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAudioData = () => {
    if (!currentTake?.audioWavBase64) return;
    const dataUri = `data:audio/wav;base64,${currentTake.audioWavBase64}`;
    navigator.clipboard.writeText(dataUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  if (!currentTake) {
    return (
      <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-6 text-center shadow-lg backdrop-blur-md">
        <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800/60 flex items-center justify-center text-neutral-400 mb-3 border border-neutral-700/50">
          <Disc3 className="w-6 h-6 animate-spin text-cyan-400/80" style={{ animationDuration: '6s' }} />
        </div>
        <h3 className="text-base font-semibold text-neutral-200">{t.masterDeckStandbyTitle}</h3>
        <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 leading-relaxed">
          {t.masterDeckStandbyDesc}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md space-y-4">
      {/* Top Header of the Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/50">
                {currentTake.mode === 'multi' ? (isArabic ? 'حوار ثنائي المتحدثين' : 'Dual-Speaker Dialogue') : currentTake.voiceName}
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {currentTake.model.replace('gemini-3.8-', '')}
              </span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isPlaying ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-neutral-800 text-neutral-400'}`}>
                {isPlaying ? t.masterDeckPlaying : t.masterDeckPaused}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-neutral-100 truncate max-w-xs sm:max-w-md mt-0.5">
              {currentTake.title}
            </h4>
          </div>
        </div>

        {/* Action buttons (Download WAV, Copy Data, Studio FX) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFxOpen(!isFxOpen)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isFxOpen || fx.preset !== 'flat'
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300'
                : 'bg-neutral-800/80 border-neutral-700/60 text-neutral-300 hover:bg-neutral-700/70'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t.masterDeckStudioFX}</span>
            {fx.preset !== 'flat' && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            )}
          </button>

          <button
            onClick={handleCopyAudioData}
            title={t.masterDeckCopyLink}
            className="p-1.5 rounded-lg border border-neutral-700/60 bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-700/70 transition-all text-xs flex items-center gap-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleDownloadWav}
            title={t.masterDeckDownloadWav}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.masterDeckDownloadWav}</span>
          </button>
        </div>
      </div>

      {/* Real-time Spectrum / Waveform Visualizer */}
      <AudioVisualizer isPlaying={isPlaying} />

      {/* Scrubbing Bar & Time Display (Always LTR for accurate time progression) */}
      <div className="space-y-1.5" dir="ltr">
        <div className="relative flex items-center">
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-neutral-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-neutral-500">
            {currentTake.durationSeconds ? `${currentTake.durationSeconds}s` : formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Transport Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Transport Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRestart}
            title={t.masterDeckRewind5}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSeekRelative(-5)}
            title={t.masterDeckRewind5}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 text-xs flex items-center gap-0.5"
          >
            <Rewind className="w-4 h-4" />
            <span className="text-[10px] font-mono">5s</span>
          </button>

          {/* Master Play/Pause Big Button */}
          <button
            onClick={handleTogglePlay}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>{t.masterDeckPaused}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{t.masterDeckPlaying}</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleSeekRelative(5)}
            title={t.masterDeckForward5}
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-all active:scale-95 text-xs flex items-center gap-0.5"
          >
            <span className="text-[10px] font-mono">5s</span>
            <FastForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => setLoop(!loop)}
            title={t.masterDeckLoop}
            className={`p-2 rounded-xl border transition-all ${
              loop
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed and Gain Controls */}
        <div className="flex items-center gap-3">
          {/* Speed Presets */}
          <div className="flex items-center gap-1 bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/60" dir="ltr">
            <Gauge className="w-3.5 h-3.5 text-neutral-400 ml-1.5 mr-0.5" />
            {[0.75, 1.0, 1.25, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all ${
                  fx.playbackRate === speed
                    ? 'bg-cyan-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Volume Gain Slider */}
          <div className="flex items-center gap-1.5 bg-neutral-800/80 px-2.5 py-1.5 rounded-xl border border-neutral-700/60" dir="ltr">
            <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="range"
              min={0}
              max={1.5}
              step={0.05}
              value={fx.gain}
              onChange={(e) => handleGainChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              title={`${t.masterDeckGain}: ${Math.round(fx.gain * 100)}%`}
            />
            <span className="text-[10px] font-mono text-neutral-400 w-7 text-right">
              {Math.round(fx.gain * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Expandable Studio DSP Rack */}
      {isFxOpen && (
        <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-5 gap-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800/80 animate-in fade-in slide-in-from-top-1 duration-200">
          {[
            {
              id: 'flat',
              name: t.fxPresetFlat,
              desc: t.fxPresetFlatDesc,
            },
            {
              id: 'warm',
              name: t.fxPresetWarm,
              desc: t.fxPresetWarmDesc,
            },
            {
              id: 'podcast',
              name: t.fxPresetPodcast,
              desc: t.fxPresetPodcastDesc,
            },
            {
              id: 'radio',
              name: t.fxPresetRadio,
              desc: t.fxPresetRadioDesc,
            },
            {
              id: 'reverb',
              name: t.fxPresetReverb,
              desc: t.fxPresetReverbDesc,
            },
          ].map((preset) => {
            const isSelected = fx.preset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleFXChange(preset.id as AudioFXConfig['preset'])}
                className={`p-2.5 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500/80 text-cyan-200 shadow-sm'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="font-semibold text-xs flex items-center justify-between">
                  <span>{preset.name}</span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                </div>
                <div className="text-[10px] text-neutral-400 mt-1 leading-snug line-clamp-2">
                  {preset.desc}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
