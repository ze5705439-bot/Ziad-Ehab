import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Zap,
  Sparkles,
  ArrowRightLeft,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import {
  PREBUILT_VOICES,
  VOCAL_BURSTS,
  SAMPLE_SCRIPTS,
  SpeakerConfig,
  SpeakerTurn,
  SessionTake
} from '../types/tts';
import { useLanguage } from '../i18n/LanguageContext';

interface DualSpeakerStudioProps {
  onTakeGenerated: (take: SessionTake) => void;
  onFallbackRequested: (text: string) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

export function DualSpeakerStudio({
  onTakeGenerated,
  onFallbackRequested,
  isGenerating,
  setIsGenerating,
}: DualSpeakerStudioProps) {
  const { t, isArabic } = useLanguage();

  const [speakers, setSpeakers] = useState<SpeakerConfig[]>(() => {
    return isArabic
      ? [
          { name: 'طارق', voice: 'Puck', roleDescription: 'مقدم البودكاست الحيوي' },
          { name: 'سارة', voice: 'Kore', roleDescription: 'باحثة صوتيات وخبيرة ذكاء اصطناعي' },
        ]
      : [
          { name: 'Alex', voice: 'Puck', roleDescription: 'Tech optimist podcast host' },
          { name: 'Sam', voice: 'Kore', roleDescription: 'Skeptical investigative journalist' },
        ];
  });

  const [turns, setTurns] = useState<SpeakerTurn[]>(() => {
    return isArabic
      ? [
          {
            id: '1',
            speaker: 'طارق',
            text: 'أهلاً بكم في استوديو الحوار! <breath> اليوم نجرب توليد حوار كامل متعدد المتحدثين بنبرة صوتية واقعية.',
            style: 'نبرة مقدم حماسي وسريع الإيقاع',
          },
          {
            id: '2',
            speaker: 'سارة',
            text: 'أهلاً يا طارق! |yeah| القدرة على كتابة سيناريو مع وقفات التنفس والضحك تنقل الأداء إلى مستوى جديد تماماً.',
            style: 'نبرة خبيرة فصيحة ومبتسمة',
          },
          {
            id: '3',
            speaker: 'طارق',
            text: 'استمعي إلى مدى سلاسة الانتقال بين أصواتنا! <laugh> لا يوجد أي انقطاع آلي جاف.',
            style: 'ضحكة خفيفة ونبرة معجبة ومرحة',
          },
          {
            id: '4',
            speaker: 'سارة',
            text: '|mhm| بالضبط! هذا مثالي تماماً لإنتاج البودكاست والدراما الإذاعية والأفلام الوثائقية.',
            style: 'إيماءة تأكيد ختامية رصينة',
          },
        ]
      : [
          {
            id: '1',
            speaker: 'Alex',
            text: 'Welcome back to the studio! <breath> Today we are diving into full multi-speaker neural voice generation.',
            style: 'Enthusiastic and fast-paced podcast host',
          },
          {
            id: '2',
            speaker: 'Sam',
            text: 'That is right Alex. |yeah| The ability to script dialogue turns with backchanneling and vocal bursts is a huge leap forward.',
            style: 'Curious and articulate co-host',
          },
          {
            id: '3',
            speaker: 'Alex',
            text: 'Listen to how naturally our cadences weave together! <laugh> No awkward robotic pauses between turns.',
            style: 'Playful and bright',
          },
          {
            id: '4',
            speaker: 'Sam',
            text: '|mhm| Exactly. Perfect for podcasts, audio dramas, and interactive game screenplays.',
            style: 'Thoughtful agreement with a warm finish',
          },
        ];
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUpdateSpeaker = (index: number, updates: Partial<SpeakerConfig>) => {
    const updated = [...speakers];
    const oldName = updated[index].name;
    updated[index] = { ...updated[index], ...updates };
    setSpeakers(updated);

    if (updates.name && updates.name !== oldName) {
      setTurns((prev) =>
        prev.map((t) => (t.speaker === oldName ? { ...t, speaker: updates.name! } : t))
      );
    }
  };

  const handleAddTurn = () => {
    const lastSpeaker = turns.length > 0 ? turns[turns.length - 1].speaker : speakers[0].name;
    const nextSpeaker = lastSpeaker === speakers[0].name ? speakers[1].name : speakers[0].name;

    const newTurn: SpeakerTurn = {
      id: `turn-${Date.now()}`,
      speaker: nextSpeaker,
      text: '',
      style: '',
    };
    setTurns([...turns, newTurn]);
  };

  const handleRemoveTurn = (id: string) => {
    if (turns.length <= 1) return;
    setTurns(turns.filter((t) => t.id !== id));
  };

  const handleUpdateTurn = (id: string, updates: Partial<SpeakerTurn>) => {
    setTurns(turns.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleInsertTagToTurn = (turnId: string, tag: string) => {
    setTurns((prev) =>
      prev.map((t) => (t.id === turnId ? { ...t, text: (t.text ? t.text + ' ' : '') + tag } : t))
    );
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_SCRIPTS.find((s) => s.id === sampleId);
    if (sample && sample.speakers) {
      setSpeakers(sample.speakers);
      const turnsToLoad = isArabic ? (sample.turnsAr || sample.turns || []) : (sample.turns || []);
      if (turnsToLoad.length > 0) {
        setTurns(turnsToLoad);
      }
    }
  };

  const handleGenerate = async () => {
    const validTurns = turns.filter((t) => t.text.trim().length > 0);
    if (validTurns.length === 0) {
      setErrorMessage(isArabic ? 'يرجى كتابة نص لجملة حوارية واحدة على الأقل.' : 'Please add text for at least one dialogue line.');
      return;
    }

    setErrorMessage(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'multi',
          turns: validTurns,
          speakers,
          model: 'gemini-3.8-flash-tts',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const errorText = data.error || (isArabic ? 'فشل توليد الحوار متعدد المتحدثين.' : 'Failed to generate multi-speaker screenplay.');
        setErrorMessage(errorText);
        if (data.fallbackAvailable) {
          const combined = validTurns.map((t) => `${t.speaker}: ${t.text}`).join('\n');
          onFallbackRequested(combined);
        }
        return;
      }

      const titleFirstLine = `${speakers[0].name} & ${speakers[1].name} Screenplay`;
      const newTake: SessionTake = {
        id: `take-${Date.now()}`,
        title: titleFirstLine,
        timestamp: Date.now(),
        durationSeconds: data.durationSeconds || Math.round(validTurns.length * 3.5),
        mode: 'multi',
        model: 'gemini-3.8-flash-tts',
        voiceName: `${speakers[0].voice} + ${speakers[1].voice}`,
        textSnippet: validTurns[0].text.slice(0, 70) + '...',
        audioWavBase64: data.audioWavBase64,
      };

      onTakeGenerated(newTake);
    } catch (err: any) {
      console.error('Multi-speaker synthesis error:', err);
      setErrorMessage(
        err?.message || (isArabic ? 'حدث خطأ في الاتصال بالخادم أثناء توليد الحوار.' : 'Network error communicating with speech server.')
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.multiTitle}</h2>
            <p className="text-xs text-neutral-400">{t.multiSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Preset Screenplays */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.multiSampleDialoguesLabel}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SAMPLE_SCRIPTS.filter((s) => s.mode === 'multi').map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => handleLoadSample(s.id)}
              className="p-3 rounded-xl border border-neutral-800/90 bg-neutral-950/60 hover:bg-neutral-900 hover:border-neutral-700 text-left transition-all"
            >
              <div className="font-semibold text-xs text-neutral-200">
                {isArabic ? s.titleAr : s.title}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                {isArabic ? s.categoryAr : s.category}
              </div>
              <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">
                {isArabic ? s.descriptionAr : s.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Cast & Speakers Config */}
      <div className="space-y-3 p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800/80">
        <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.multiSpeakerConfigTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Speaker A */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300">{t.speakerAName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Speaker A
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="text"
                value={speakers[0].name}
                onChange={(e) => handleUpdateSpeaker(0, { name: e.target.value })}
                placeholder="Speaker Name"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400">{t.speakerVoice}</label>
              <select
                value={speakers[0].voice}
                onChange={(e) => handleUpdateSpeaker(0, { voice: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {PREBUILT_VOICES.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({isArabic ? (v.gender === 'Female' ? 'أنثى' : 'ذكر') : v.gender}) - {isArabic ? v.toneAr : v.tone}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Speaker B */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">{t.speakerBName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-400 border border-blue-800">
                Speaker B
              </span>
            </div>
            <div className="space-y-1">
              <input
                type="text"
                value={speakers[1].name}
                onChange={(e) => handleUpdateSpeaker(1, { name: e.target.value })}
                placeholder="Speaker Name"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-neutral-400">{t.speakerVoice}</label>
              <select
                value={speakers[1].voice}
                onChange={(e) => handleUpdateSpeaker(1, { voice: e.target.value })}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {PREBUILT_VOICES.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({isArabic ? (v.gender === 'Female' ? 'أنثى' : 'ذكر') : v.gender}) - {isArabic ? v.toneAr : v.tone}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Screenplay Turn Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.dialogueScriptTitle}</span>
          </label>
          <button
            type="button"
            onClick={handleAddTurn}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-cyan-300 hover:text-white border border-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.addTurnBtn}</span>
          </button>
        </div>

        <div className="space-y-3">
          {turns.map((turn, index) => {
            const isSpeakerA = turn.speaker === speakers[0].name;
            return (
              <div
                key={turn.id}
                className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                  isSpeakerA
                    ? 'bg-neutral-950/80 border-cyan-500/30'
                    : 'bg-neutral-950/80 border-blue-500/30'
                }`}
              >
                {/* Line top bar: Speaker selector & Delete */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-neutral-500">#{index + 1}</span>
                    <span className="text-xs text-neutral-400">{t.turnSpeakerLabel}</span>
                    <select
                      value={turn.speaker}
                      onChange={(e) => handleUpdateTurn(turn.id, { speaker: e.target.value })}
                      className="bg-neutral-900 border border-neutral-700 text-xs font-bold text-white rounded-lg px-2 py-1 focus:outline-none focus:border-cyan-500"
                    >
                      <option value={speakers[0].name}>{speakers[0].name} (Speaker A)</option>
                      <option value={speakers[1].name}>{speakers[1].name} (Speaker B)</option>
                    </select>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateTurn(turn.id, {
                          speaker: isSpeakerA ? speakers[1].name : speakers[0].name,
                        })
                      }
                      title={t.swapSpeakerTitle}
                      className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-cyan-400 transition-colors"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                    </button>
                  </div>

                  {turns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTurn(turn.id)}
                      title={t.deleteTurnTitle}
                      className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Line text */}
                <textarea
                  rows={2}
                  value={turn.text}
                  onChange={(e) => handleUpdateTurn(turn.id, { text: e.target.value })}
                  placeholder={t.turnTextPlaceholder}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                />

                {/* Line emotion / speech direction */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={turn.style || ''}
                    onChange={(e) => handleUpdateTurn(turn.id, { style: e.target.value })}
                    placeholder={t.turnStylePlaceholder}
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-[11px] text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />

                  {/* Vocal burst mini tags for this turn */}
                  <div className="flex items-center gap-1">
                    {VOCAL_BURSTS.slice(0, 4).map((burst) => (
                      <button
                        key={burst.tag}
                        type="button"
                        onClick={() => handleInsertTagToTurn(turn.id, burst.tag)}
                        className="px-1.5 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-cyan-300 border border-neutral-800"
                        title={burst.desc}
                      >
                        {burst.tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <p className="font-semibold">{isArabic ? 'تنبيه في السيناريو' : 'Screenplay Notice'}</p>
            <p className="text-[11px] text-rose-200/90 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.multiGeneratingBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.multiGenerateBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
