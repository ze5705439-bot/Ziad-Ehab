import { useState, useEffect } from 'react';
import {
  Laptop,
  Play,
  Square,
  Sliders,
  Volume2,
  Gauge,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface BrowserNativeStudioProps {
  initialText?: string;
}

export function BrowserNativeStudio({ initialText }: BrowserNativeStudioProps) {
  const { t, isArabic } = useLanguage();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');
  const [pitch, setPitch] = useState<number>(1.0);
  const [rate, setRate] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [text, setText] = useState<string>(
    initialText ||
      (isArabic
        ? 'هذا الصوت يتم توليده محلياً داخل متصفحك مباشرة بدون أي تأخير ودون الحاجة إلى اتصال خارجي.'
        : 'This speech is generated client-side by your local browser speech synthesis engine with zero latency and no external network requests.')
  );
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoiceURI) {
        if (isArabic) {
          const arabicVoice =
            available.find((v) => v.lang.startsWith('ar')) ||
            available.find((v) => v.name.toLowerCase().includes('arabic')) ||
            available[0];
          if (arabicVoice) setSelectedVoiceURI(arabicVoice.voiceURI);
        } else {
          const defaultVoice =
            available.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ||
            available.find((v) => v.lang.startsWith('en')) ||
            available[0];
          if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
        }
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedVoiceURI, isArabic]);

  // If initialText changes from parent fallback
  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoiceURI) {
      const match = voices.find((v) => v.voiceURI === selectedVoiceURI);
      if (match) utterance.voice = match;
    }

    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const hasArabicVoice = voices.some((v) => v.lang.startsWith('ar'));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Laptop className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.browserTitle}</h2>
            <p className="text-xs text-neutral-400">{t.browserSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Arabic Voice Badge notification if detected */}
      {hasArabicVoice && (
        <div className="p-3 bg-cyan-950/40 border border-cyan-800/60 rounded-xl flex items-center gap-2 text-xs text-cyan-300">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{t.browserArabicVoiceDetected}</span>
        </div>
      )}

      {/* Voice selection */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.browserVoiceSelectLabel}</span>
        </label>
        {voices.length === 0 ? (
          <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400">
            {t.browserNoVoices}
          </div>
        ) : (
          <select
            value={selectedVoiceURI}
            onChange={(e) => setSelectedVoiceURI(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {voices.map((v) => {
              const isAr = v.lang.startsWith('ar');
              return (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {isAr ? '🟢 [عربي] ' : ''}{v.name} ({v.lang}) {v.default ? '— Default' : ''}
                </option>
              );
            })}
          </select>
        )}
      </div>

      {/* Sliders: Pitch, Rate, Volume */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800/80" dir="ltr">
        {/* Pitch */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 font-sans">{t.browserPitch}</span>
            <span className="font-mono text-cyan-400">{pitch.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 font-sans">{t.browserRate}</span>
            <span className="font-mono text-cyan-400">{rate.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2.0}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* Volume */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 font-sans">{t.browserVolume}</span>
            <span className="font-mono text-cyan-400">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1.0}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-300">
          {t.browserTextLabel}
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-neutral-400">
          {isSpeaking && (
            <span className="flex items-center gap-1.5 text-cyan-400 animate-pulse font-medium">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {t.browserSpeaking}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              type="button"
              onClick={handleStop}
              className="px-4 py-2.5 rounded-xl border border-rose-800/80 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Square className="w-3.5 h-3.5" />
              <span>{t.browserStopBtn}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSpeak}
            disabled={!text.trim()}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{t.browserSpeakBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
