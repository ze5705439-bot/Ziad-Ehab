import { useState, useMemo } from 'react';
import {
  Sparkles,
  Sliders,
  Volume2,
  CheckCircle2,
  Send,
  Zap,
  Flame
} from 'lucide-react';
import { PREBUILT_VOICES, SessionTake } from '../types/tts';
import { useLanguage } from '../i18n/LanguageContext';

interface VoicePersonaDesignerProps {
  onTakeGenerated: (take: SessionTake) => void;
  onApplyPersonaToStudio: (voice: string, stylePrompt: string) => void;
  isGenerating: boolean;
  setIsGenerating: (loading: boolean) => void;
}

interface Archetype {
  id: string;
  name: string;
  nameAr: string;
  baseVoice: string;
  tagline: string;
  taglineAr: string;
  warmth: number;
  energy: number;
  gravitas: number;
  formality: number;
  sampleText: string;
  sampleTextAr: string;
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'cyber-nav',
    name: 'Cyberpunk Navigator',
    nameAr: 'مساعد ذكاء اصطناعي مستقبلي',
    baseVoice: 'Zephyr',
    tagline: 'Crisp, synthetic HUD assistant guiding orbital ships',
    taglineAr: 'نبرة رقمية دقيقة ومعاصرة، توجه مسارات الملاحة الفضائية',
    warmth: 30,
    energy: 65,
    gravitas: 80,
    formality: 90,
    sampleText: 'Slipstream conduit locked. Warning: magnetic flux anomaly detected in quadrant nine. Proceed with caution.',
    sampleTextAr: 'تم تفعيل مسار الملاحة الفضائي. تحذير: رصد اضطراب مغناطيسي في القطاع التاسع. يُرجى توخي الحذر.',
  },
  {
    id: 'noir-detective',
    name: 'Grizzled Noir Detective',
    nameAr: 'المحقق السينمائي الغامض',
    baseVoice: 'Charon',
    tagline: 'Deep, weary, cinematic narration on wet asphalt',
    taglineAr: 'نبرة عميقة وجهورية مفعمة بالغموض والوقار السينمائي',
    warmth: 20,
    energy: 35,
    gravitas: 95,
    formality: 40,
    sampleText: 'The neon signs flicker through the venetian blinds. <sigh> In this city, everyone has a secret, and nobody leaves clean.',
    sampleTextAr: 'تنعكس أضواء النيون على زجاج النافذة المبتل. <sigh> في هذه المدينة، كل شخص يخفي سراً، ولا أحد يخرج بريئاً.',
  },
  {
    id: 'meditation-zen',
    name: 'Zen Sanctuary Guide',
    nameAr: 'مرشد السكينة والتأمل الهادئ',
    baseVoice: 'Aoede',
    tagline: 'Gentle, breathy, soothing mindfulness presence',
    taglineAr: 'همس هادئ ومريح للأعصاب يملأ الروح بالسلام الداخلي',
    warmth: 95,
    energy: 15,
    gravitas: 40,
    formality: 60,
    sampleText: 'Breathe in peace ... <breath> and gently let go of all tension in your body. You are safe, grounded, and present.',
    sampleTextAr: 'تنفس بعمق وسلام ... <breath> ودع كل مشاعر التوتر تتلاشى بهدوء. أنت في أمان تام وسكينة.',
  },
  {
    id: 'esports-caster',
    name: 'High-Octane Caster',
    nameAr: 'المعلق الرياضي الحماسي',
    baseVoice: 'Fenrir',
    tagline: 'Rapid-fire, electric arena play-by-play commentary',
    taglineAr: 'إلقاء سريع متدفق ينبض بالحماس والإثارة والتشويق',
    warmth: 40,
    energy: 95,
    gravitas: 75,
    formality: 30,
    sampleText: 'HE GOES FOR THE FLANK! <gasp> Incredible reaction time as the counter-attack completely wipes the board!',
    sampleTextAr: 'يا له من هجوم مباغت لا يُصدق! <gasp> سرعة رد فعل خيالية تغير مجريات المباراة بالكامل!',
  },
  {
    id: 'tech-visionary',
    name: 'Silicon Keynote Founder',
    nameAr: 'رائد التقنية الملهم',
    baseVoice: 'Puck',
    tagline: 'Inspiring, poised, conversational visionary leader',
    taglineAr: 'نبرة واثقة ملهمة تحث على الابتكار وإعادة تشكيل المستقبل',
    warmth: 70,
    energy: 75,
    gravitas: 65,
    formality: 80,
    sampleText: 'We asked ourselves: what if the interface simply disappeared? <breath> Today, that vision becomes reality.',
    sampleTextAr: 'تساءلنا دائماً: ماذا لو اختفت كل الحواجز؟ <breath> اليوم، تصبح تلك الرؤية واقعاً ملموساً بين أيديكم.',
  },
  {
    id: 'bedtime-story',
    name: 'Fairy Tale Bard',
    nameAr: 'راوي الحكايات والأساطير',
    baseVoice: 'Kore',
    tagline: 'Warm, lyrical, whimsical storybook narrator',
    taglineAr: 'إلقاء قصصي دافئ وشاعري يأخذ المستمع في رحلة خيالية ساحرة',
    warmth: 90,
    energy: 50,
    gravitas: 50,
    formality: 50,
    sampleText: 'Once upon a starlit eve, beyond the Whispering Woods, lived a small dragon who dreamed of painting constellations.',
    sampleTextAr: 'في ليلة مقمرة وراء غابات الأسرار القديمة، كان هناك تنين صغير يحلم برسم النجوم في سماء الليل.',
  },
];

export function VoicePersonaDesigner({
  onTakeGenerated,
  onApplyPersonaToStudio,
  isGenerating,
  setIsGenerating,
}: VoicePersonaDesignerProps) {
  const { t, isArabic } = useLanguage();
  const [selectedArchetype, setSelectedArchetype] = useState<string>('tech-visionary');
  const [baseVoice, setBaseVoice] = useState('Puck');
  const [warmth, setWarmth] = useState(70);
  const [energy, setEnergy] = useState(75);
  const [gravitas, setGravitas] = useState(65);
  const [formality, setFormality] = useState(80);
  const [sampleText, setSampleText] = useState(
    isArabic
      ? 'تساءلنا دائماً: ماذا لو اختفت كل الحواجز؟ <breath> اليوم، تصبح تلك الرؤية واقعاً ملموساً بين أيديكم.'
      : 'We asked ourselves: what if the interface simply disappeared? <breath> Today, that vision becomes reality.'
  );
  const [appliedNotification, setAppliedNotification] = useState(false);

  const synthesizedStylePrompt = useMemo(() => {
    if (isArabic) {
      const wDesc = warmth > 70 ? 'شديد الدفء والتعاطف' : warmth < 35 ? 'نبرة حيادية باردة' : 'دفء متوازن';
      const eDesc = energy > 70 ? 'إيقاع سريع مفعم بالحماس' : energy < 35 ? 'إيقاع هادئ وبطيء' : 'إيقاع حواري طبيعي';
      const gDesc = gravitas > 70 ? 'وقار مسرحي وفخامة درامية عميقة' : gravitas < 35 ? 'نبرة خفيفة عفوية' : 'رصانة واثقة';
      const fDesc = formality > 70 ? 'فصاحة تامة ومخارج حروف واضحة' : formality < 35 ? 'حديث يومي بسيط' : 'فصحى معاصرة';
      return `نبرة تتسم بـ: ${wDesc}، و${eDesc}، و${gDesc}، مع ${fDesc}. إلقاء احترافي وطبيعي.`;
    } else {
      const wDesc = warmth > 70 ? 'deeply warm and empathetic' : warmth < 35 ? 'cool, analytical' : 'moderate warmth';
      const eDesc = energy > 70 ? 'dynamic high energy tempo' : energy < 35 ? 'patient, slow contemplative tempo' : 'natural conversational tempo';
      const gDesc = gravitas > 70 ? 'heavy gravitas and solemn resonance' : gravitas < 35 ? 'lighthearted delivery' : 'composed authority';
      const fDesc = formality > 70 ? 'meticulous articulation' : formality < 35 ? 'informal phrasing' : 'polished delivery';
      return `Custom sculpted voice persona: ${wDesc}, ${eDesc}, ${gDesc}, with ${fDesc}. Natural cadence and breathing.`;
    }
  }, [warmth, energy, gravitas, formality, isArabic]);

  const handleSelectArchetype = (arch: Archetype) => {
    setSelectedArchetype(arch.id);
    setBaseVoice(arch.baseVoice);
    setWarmth(arch.warmth);
    setEnergy(arch.energy);
    setGravitas(arch.gravitas);
    setFormality(arch.formality);
    setSampleText(isArabic ? arch.sampleTextAr : arch.sampleText);
  };

  const handleAudition = async () => {
    if (!sampleText.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'single',
          text: sampleText,
          voice: baseVoice,
          style: synthesizedStylePrompt,
          model: 'gemini-3.8-flash-tts',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to synthesize audition take');
      }

      const activeArch = ARCHETYPES.find((a) => a.id === selectedArchetype);
      const titlePrefix = activeArch ? (isArabic ? activeArch.nameAr : activeArch.name) : 'Sculpted Persona';

      const newTake: SessionTake = {
        id: `persona-${Date.now()}`,
        title: `${titlePrefix} (${baseVoice})`,
        timestamp: Date.now(),
        durationSeconds: data.durationSeconds || 4,
        mode: 'persona',
        model: 'gemini-3.8-flash-tts',
        voiceName: baseVoice,
        textSnippet: sampleText.slice(0, 75) + '...',
        audioWavBase64: data.audioWavBase64,
        style: synthesizedStylePrompt,
      };

      onTakeGenerated(newTake);
    } catch (err: any) {
      console.error('Audition error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToStudio = () => {
    onApplyPersonaToStudio(baseVoice, synthesizedStylePrompt);
    setAppliedNotification(true);
    setTimeout(() => setAppliedNotification(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">{t.personaTitle}</h2>
            <p className="text-xs text-neutral-400">{t.personaSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Archetype Quick Pickers */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.personaArchetypesTitle}</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {ARCHETYPES.map((arch) => {
            const isSelected = selectedArchetype === arch.id;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => handleSelectArchetype(arch)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-neutral-800 border-cyan-500 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                    : 'bg-neutral-950/70 border-neutral-800/90 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-neutral-100">
                    {isArabic ? arch.nameAr : arch.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {arch.baseVoice}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 mt-1 leading-snug">
                  {isArabic ? arch.taglineAr : arch.tagline}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Base Voice Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
          <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
          <span>{t.personaBaseVoiceLabel}</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PREBUILT_VOICES.map((v) => (
            <button
              key={v.name}
              type="button"
              onClick={() => setBaseVoice(v.name)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                baseVoice === v.name
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 shadow-sm'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Acoustic Parameter Sliders */}
      <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800/80 space-y-4">
        {/* Warmth & Empathy */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">{t.personaWarmthLabel}</span>
            <span className="font-mono text-cyan-400">{warmth}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={warmth}
            onChange={(e) => setWarmth(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-neutral-500">{t.personaWarmthDesc}</p>
        </div>

        {/* Energy & Tempo */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">{t.personaEnergyLabel}</span>
            <span className="font-mono text-cyan-400">{energy}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-neutral-500">{t.personaEnergyDesc}</p>
        </div>

        {/* Gravitas & Dramatic Weight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">{t.personaGravitasLabel}</span>
            <span className="font-mono text-cyan-400">{gravitas}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={gravitas}
            onChange={(e) => setGravitas(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-neutral-500">{t.personaGravitasDesc}</p>
        </div>

        {/* Formality & Articulation */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-200">{t.personaFormalityLabel}</span>
            <span className="font-mono text-cyan-400">{formality}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={formality}
            onChange={(e) => setFormality(parseInt(e.target.value))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <p className="text-[10px] text-neutral-500">{t.personaFormalityDesc}</p>
        </div>
      </div>

      {/* Synthesized Prompt Preview */}
      <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800 text-xs space-y-1">
        <span className="text-[10px] font-mono text-cyan-400 uppercase">
          {isArabic ? 'توجيه المشاعر السمعية المُولَّد تلقائياً' : 'Synthesized Acoustic Prompt'}
        </span>
        <p className="text-neutral-300 font-sans italic leading-relaxed">"{synthesizedStylePrompt}"</p>
      </div>

      {/* Audition Script Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-neutral-300">
          {t.personaAuditionTextLabel}
        </label>
        <textarea
          rows={3}
          value={sampleText}
          onChange={(e) => setSampleText(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
        />
      </div>

      {/* Applied Notification */}
      {appliedNotification && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/80 rounded-xl flex items-center gap-2 text-xs text-emerald-300 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{t.personaAppliedMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleApplyToStudio}
          className="px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.personaApplyBtn}</span>
        </button>

        <button
          type="button"
          onClick={handleAudition}
          disabled={isGenerating || !sampleText.trim()}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 active:scale-95 transition-all"
        >
          {isGenerating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{t.personaAuditioningBtn}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.personaAuditionBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
