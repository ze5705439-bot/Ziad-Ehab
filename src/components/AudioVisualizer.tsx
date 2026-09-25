import { useEffect, useRef, useState } from 'react';
import { studioAudio } from '../utils/audioEngine';
import { Activity, BarChart2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AudioVisualizerProps {
  isPlaying: boolean;
  accentColor?: string;
}

export function AudioVisualizer({ isPlaying }: AudioVisualizerProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualMode, setVisualMode] = useState<'wave' | 'spectrum'>('spectrum');
  const [peakLevel, setPeakLevel] = useState<number>(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    try {
      analyser = studioAudio.getAnalyser();
    } catch (e) {
      // AudioContext not ready yet
    }

    const render = () => {
      animationFrameId.current = requestAnimationFrame(render);

      const width = canvas.width;
      const height = canvas.height;

      // Dark background with subtle grid line
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // Subtle horizontal center grid line
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      if (!analyser || !isPlaying) {
        // Idle ambient breathing line
        const tNow = performance.now() * 0.002;
        ctx.beginPath();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.03 + tNow) * (isPlaying ? 8 : 2);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        setPeakLevel(0);
        return;
      }

      if (visualMode === 'wave') {
        const bufferLength = analyser.fftSize;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        let maxDev = 0;
        ctx.lineWidth = 2.5;

        // Gradient for neon waveform
        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, '#06b6d4');
        gradient.addColorStop(0.5, '#3b82f6');
        gradient.addColorStop(1, '#a855f7');

        ctx.strokeStyle = gradient;
        ctx.beginPath();

        const sliceWidth = (width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;
          const dev = Math.abs(dataArray[i] - 128);
          if (dev > maxDev) maxDev = dev;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();
        setPeakLevel(Math.min(100, Math.round((maxDev / 128) * 100)));
      } else {
        // Spectrum frequency analyzer
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const barCount = 48;
        const barWidth = (width / barCount) - 2;
        let sum = 0;

        for (let i = 0; i < barCount; i++) {
          // Sample logarithmically across frequency bins
          const binIndex = Math.floor(Math.pow(i / barCount, 1.8) * (bufferLength - 1));
          const val = dataArray[binIndex] || 0;
          sum += val;

          const barHeight = Math.max(3, (val / 255) * (height - 10));
          const x = i * (barWidth + 2);
          const y = height - barHeight;

          // Spectrum gradient
          const barGrad = ctx.createLinearGradient(0, height, 0, y);
          barGrad.addColorStop(0, '#06b6d4');
          barGrad.addColorStop(0.7, '#3b82f6');
          barGrad.addColorStop(1, '#ec4899');

          ctx.fillStyle = barGrad;
          // Rounded top bar
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
          } else {
            ctx.rect(x, y, barWidth, barHeight);
          }
          ctx.fill();
        }

        const avg = sum / barCount;
        setPeakLevel(Math.min(100, Math.round((avg / 255) * 130)));
      }
    };

    render();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying, visualMode]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#0a0a0f] border border-neutral-800 shadow-inner">
      <canvas
        ref={canvasRef}
        width={700}
        height={110}
        className="w-full h-24 sm:h-28 block"
      />

      {/* Mode switch & peak indicator overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 pointer-events-auto bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-lg p-0.5 text-[10px]">
          <button
            onClick={() => setVisualMode('spectrum')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
              visualMode === 'spectrum'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <BarChart2 className="w-3 h-3" />
            <span>{t.masterDeckSpectrum}</span>
          </button>
          <button
            onClick={() => setVisualMode('wave')}
            className={`px-2 py-0.5 rounded flex items-center gap-1 transition-all ${
              visualMode === 'wave'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>{t.masterDeckWaveform}</span>
          </button>
        </div>

        {/* Peak VU Meter */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] bg-neutral-900/80 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-neutral-800 text-neutral-300">
          <span className="text-neutral-400">VU:</span>
          <div className="w-16 h-2 bg-neutral-800 rounded-full overflow-hidden flex" dir="ltr">
            <div
              className={`h-full transition-all duration-75 ${
                peakLevel > 85 ? 'bg-rose-500' : peakLevel > 60 ? 'bg-amber-400' : 'bg-cyan-400'
              }`}
              style={{ width: `${peakLevel}%` }}
            />
          </div>
          <span className="w-6 text-right text-[9px]">{peakLevel}%</span>
        </div>
      </div>
    </div>
  );
}
