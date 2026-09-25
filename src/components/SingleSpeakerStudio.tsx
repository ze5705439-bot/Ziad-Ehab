import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Sparkles,
  Zap,
  BookOpen,
  Volume2,
  Wand2,
  AlertCircle,
  HelpCircle,
  Type
} from 'lucide-react';
import {
  PREBUILT_VOICES,
  STYLE_PRESETS,
  VOCAL_BURSTS,
  TASHKEEL_MARKS,
  SAMPLE_SCRIPTS,
  SessionTake
} from '../types/tts';
import { useLanguage } from '../i18n/LanguageContext';

interface SingleSpeakerStudioProps {
  onTakeGenerated: (take: SessionTake) => void;
  onFallbackRequested: (text: string) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export function SingleSpeakerStudio({
  onTakeGenerated,
  onFallbackRequested,
  isGenerating,
  setIsGenerating
}: SingleSpeakerStudioProps) {
  const { t, isArabic } = useLanguage();
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash-lite-tts' | 'gemini-3.8-flash-tts'>('gemini-3.8-flash-lite-tts');
  const [stylePrompt, setStylePrompt] = useState(
    isArabic ? 'نبرة دافئة وتفاعلية وفصيحة وناصعة الوضوح' : 'Warm, engaging, articulate, and clear'
  );
  const [scriptText, setScriptText] = useState(
    isArabic
      ? `أَهْلَاً بِكُمْ فِي اسْتُودْيُو فُوكس لِلصَّوْتِ الذَّكِيّ. <breath> تَسْتَمِعُونَ الآنَ إِلَى صَوْتٍ عَصَبِيٍّ بَشَرِيٍّ فَائِقِ الدِّقَّةِ مَعَ مَخَارِجِ حُرُوفٍ عَرَبِيَّةٍ فَصِيحَة، وَوَقَفَاتِ تَنَفُّسٍ عَفْوِيَّة. كَيْفَ يُمْكِنُنِي مُسَاعَدَتُكُمْ فِي إِنْتَاجِكُمْ الإِذَاعِيِّ اليَوْم؟`
      : `Welcome to the VoxStudio Text-to-Speech Console. <breath> You are listening to high-fidelity neural audio generated with natural inflections, pauses, and expressive cadence. How may I assist your broadcast today?`
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTashkeelTip, setShowTashkeelTip] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Update default text if language switches and text was untouched default
  useEffect(() => {
    if (isArabic && scriptText.includes('Welcome to the VoxStudio')) {
      setScriptText(`أَهْلَاً بِكُمْ فِي اسْتُودْيُو فُوكس لِلصَّوْتِ الذَّكِيّ. <breath> تَسْتَمِعُونَ الآنَ إِلَى صَوْتٍ عَصَبِيٍّ بَشَرِيٍّ فَائِقِ الدِّقَّةِ مَعَ مَخَارِجِ حُرُوفٍ عَرَبِيَّةٍ فَصِيحَة، وَوَقَفَاتِ تَنَفُّسٍ عَفْوِيَّة. كَيْفَ يُمْكِنُنِي مُسَاعَدَتُكُمْ فِي إِنْتَاجِكُمْ الإِذَاعِيِّ اليَوْم؟`);
      setStylePrompt('نبرة دافئة وتفاعلية وفصيحة وناصعة الوضوح');
    }
  }, [isArabic]);

  // Statistics
  const charCount = scriptText.length;
  const wordCount = scriptText.trim() ? scriptText.trim().split(/\s+/).length : 0;
  const estSeconds = Math.max(1, Math.round(wordCount / 2.3));

  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setScriptText((prev) => prev + ' ' + tag);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = scriptText;
    const newText = text.substring(0, start) + tag + text.substring(end);
    setScriptText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + tag.length;
    }, 10);
  };

  const handleInsertTashkeel = (mark: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setScriptText((prev) => prev + mark);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = scriptText;
    const newText = text.substring(0, start) + mark + text.substring(end);
    setScriptText(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + mark.length;
    }, 10);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_SCRIPTS.find((s) => s.id === sampleId);
    if (sample) {
      const textToUse = isArabic ? (sample.textAr || sample.text || '') : (sample.text || sample.textAr || '');
      setScriptText(textToUse);
      if (sample.voice) setSelectedVoice(sample.voice);
      if (sample.style) {
        setStylePrompt(isArabic ? (sample.styleAr || sample.style) : sample.style);
      }
    }
  };

  const handleGenerate = async () => {
    if (!scriptText.trim()) {
      setErrorMessage(isArabic ? 'يرجى كتابة نص لتوليد الصوت.' : 'Please enter some text to synthesize.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'single',
          text: scriptText,
          voice: selectedVoice,
          style: stylePrompt,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorText = data.error || (isArabic ? 'فشل توليد الصوت، يرجى المحاولة مجدداً.' : 'Failed to synthesize audio.');
        setErrorMessage(errorText);

        if (data.fallbackAvailable) {
          // Allow switching to local browser TTS
          onFallbackRequested(scriptText);
        }
        return;
      }

      // Title creation
      const firstLine = scriptText.trim().split('\n')[0] || (isArabic ? 'تسجيل استوديو' : 'Studio Take');
      const takeTitle = firstLine.slice(0, 35) + (firstLine.length > 35 ? '...' : '');

      const newTake: SessionTake = {
        id: `take-${Date.now()}`,
        title: takeTitle,
        timestamp: Date.now(),
        durationSeconds: data.durationSeconds || estSeconds,
        mode: 'single',
        model: data.model || selectedModel,
        voiceName: data.voice || selectedVoice,
        textSnippet: scriptText.slice(0, 80) + '...',
        audioWavBase64: data.audioWavBase64,
        style: stylePrompt,
      };

      onTakeGenerated(newTake);
    } catch (err: any) {
      console.error('Synthesis error:', err);
      setErrorMessage(
        err?.message || (isArabic ? 'تعذر الاتصال بخادم الصوت. يمكنك تجربة المحرك المحلي المدمج.' : 'Network error communicating with speech server. You can try Browser Offline Mode.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Workstation Header */}
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.singleTitle}</h2>
            <p className="text-xs text-neutral-400">{t.singleSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Voice Selection Carousel / Grid */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.singleVoiceLabel}</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {PREBUILT_VOICES.map((v) => {
            const isSelected = selectedVoice === v.name;
            return (
              <button
                key={v.name}
                type="button"
                onClick={() => setSelectedVoice(v.name)}
                className={`p-2.5 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-neutral-800 border-cyan-500 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-neutral-950/70 border-neutral-800/90 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-100">{v.name}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-neutral-800 text-neutral-400">
                    {isArabic ? (v.gender === 'Female' ? 'أنثى' : v.gender === 'Male' ? 'ذكر' : 'محايد') : v.gender}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-1 line-clamp-1 leading-snug">
                  {isArabic ? v.toneAr : v.tone}
                </div>
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-2 right-2 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Neural Model Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.singleModelLabel}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSelectedModel('gemini-3.8-flash-lite-tts')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedModel === 'gemini-3.8-flash-lite-tts'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/30'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-100">{t.modelFlashLiteTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                {isArabic ? 'فائق السرعة' : 'Ultra-Fast'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              {t.modelFlashLiteDesc}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedModel('gemini-3.8-flash-tts')}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedModel === 'gemini-3.8-flash-tts'
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/30'
                : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-100">{t.modelFlashFlagshipTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                {isArabic ? 'الرائد والأعلى تعبيراً' : 'Flagship Nuance'}
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
              {t.modelFlashFlagshipDesc}
            </p>
          </button>
        </div>
      </div>

      {/* Speech Direction / Style Controls */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.singleStyleCustomLabel}</span>
          </label>
          <span className="text-[10px] text-neutral-400 font-mono">speechMetadata.style</span>
        </div>

        {/* Style presets carousel */}
        <div className="flex flex-wrap gap-1.5">
          {STYLE_PRESETS.map((p) => {
            const isMatch = isArabic ? stylePrompt === p.valueAr : stylePrompt === p.value;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setStylePrompt(isArabic ? p.valueAr : p.value)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all ${
                  isMatch
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-medium'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                }`}
              >
                {isArabic ? p.labelAr : p.label}
              </button>
            );
          })}
        </div>

        <input
          type="text"
          value={stylePrompt}
          onChange={(e) => setStylePrompt(e.target.value)}
          placeholder={t.singleStyleCustomPlaceholder}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
        />
      </div>

      {/* Vocal Bursts Tags Toolbar */}
      <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-neutral-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{t.singleVocalBurstsLabel}</span>
          </span>
          <span className="text-[10px] text-neutral-400 hidden sm:inline">
            {t.singleVocalBurstsDesc}
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {VOCAL_BURSTS.map((burst) => (
            <button
              key={burst.tag}
              type="button"
              onClick={() => handleInsertTag(burst.tag)}
              title={burst.desc}
              className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-cyan-950/60 border border-neutral-800 hover:border-cyan-700/60 text-cyan-300 font-mono text-xs transition-all flex items-center gap-1 active:scale-95"
            >
              <span>{burst.tag}</span>
              <span className="text-[10px] text-neutral-400">({isArabic ? burst.desc : burst.labelEn})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Arabic Tashkeel (Diacritics) Toolbar */}
      <div className="p-3 bg-gradient-to-r from-neutral-950 via-cyan-950/20 to-neutral-950 rounded-xl border border-cyan-800/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-semibold text-neutral-200">
              {t.tashkeelBarTitle}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowTashkeelTip(!showTashkeelTip)}
            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            <HelpCircle className="w-3 h-3" />
            <span>{isArabic ? 'لماذا التشكيل مهم؟' : 'Why Tashkeel?'}</span>
          </button>
        </div>

        {showTashkeelTip && (
          <p className="text-[11px] text-neutral-300 bg-neutral-900/90 p-2.5 rounded-lg border border-cyan-800/30 leading-relaxed">
            {t.tashkeelBarTip}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-1.5" dir="rtl">
          {TASHKEEL_MARKS.map((tashkeel) => (
            <button
              key={tashkeel.name}
              type="button"
              onClick={() => handleInsertTashkeel(tashkeel.mark)}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-cyan-500/20 border border-neutral-800 hover:border-cyan-500 text-neutral-200 hover:text-cyan-300 text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              title={`إدراج ${tashkeel.name}`}
            >
              <span className="text-sm font-bold text-cyan-400 font-arabic">{tashkeel.symbol}</span>
              <span className="text-[11px]">{tashkeel.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sample Scripts Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.singleSampleScriptsLabel}</span>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_SCRIPTS.filter((s) => s.mode === 'single').map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample.id)}
              className="p-2.5 rounded-xl border border-neutral-800/90 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700 text-left transition-all"
            >
              <div className="font-semibold text-xs text-neutral-200">
                {isArabic ? sample.titleAr : sample.title}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                {isArabic ? sample.categoryAr : sample.category}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                {isArabic ? sample.descriptionAr : sample.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Script Textarea Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-300">
            {t.singleScriptLabel}
          </label>
          <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400">
            <span>
              {charCount} {t.singleCharCount}
            </span>
            <span>•</span>
            <span>
              {wordCount} {t.singleWordCount}
            </span>
            <span>•</span>
            <span className="text-cyan-400">
              ~{estSeconds} {t.singleSecs} {t.singleEstDuration}
            </span>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          rows={5}
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder={t.singleScriptPlaceholder}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 leading-relaxed font-sans"
        />
      </div>

      {/* Error notification banner if any */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold">{isArabic ? 'تنبيه في التوليد الصوتي' : 'Synthesis Notice'}</p>
            <p className="text-[11px] text-rose-200/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Action Button: Generate Speech */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !scriptText.trim()}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.singleGeneratingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.singleGenerateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
