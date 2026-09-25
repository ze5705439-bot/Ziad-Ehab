import { useState, useEffect } from 'react';
import {
  Mic,
  Users,
  Sliders,
  Laptop,
  Radio,
  Volume2,
  Info,
  X,
  Languages,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { StudioMode, SessionTake } from './types/tts';
import { MasterDeck } from './components/MasterDeck';
import { SingleSpeakerStudio } from './components/SingleSpeakerStudio';
import { DualSpeakerStudio } from './components/DualSpeakerStudio';
import { VoicePersonaDesigner } from './components/VoicePersonaDesigner';
import { BrowserNativeStudio } from './components/BrowserNativeStudio';
import { SessionTakesDrawer } from './components/SessionTakesDrawer';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';

function StudioMain() {
  const { lang, setLang, dir, isArabic, t } = useLanguage();
  const [activeMode, setActiveMode] = useState<StudioMode>('single');
  const [takes, setTakes] = useState<SessionTake[]>([]);
  const [currentTake, setCurrentTake] = useState<SessionTake | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [fallbackText, setFallbackText] = useState('');
  const [serverStatus, setServerStatus] = useState<{ hasApiKey: boolean } | null>(null);

  // Check server health
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setServerStatus({ hasApiKey: data.hasApiKey });
      })
      .catch((err) => {
        console.warn('Could not fetch server status:', err);
      });
  }, []);

  const handleTakeGenerated = (newTake: SessionTake) => {
    setTakes((prev) => [newTake, ...prev]);
    setCurrentTake(newTake);
  };

  const handleSelectTake = (take: SessionTake) => {
    setCurrentTake(take);
  };

  const handleDeleteTake = (id: string) => {
    setTakes((prev) => prev.filter((t) => t.id !== id));
    if (currentTake?.id === id) {
      const remaining = takes.filter((t) => t.id !== id);
      setCurrentTake(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const handleClearAllTakes = () => {
    setTakes([]);
    setCurrentTake(null);
  };

  const handleFallbackRequested = (text: string) => {
    setFallbackText(text);
    setActiveMode('browser');
  };

  const handleApplyPersonaToStudio = (_voice: string, _stylePrompt: string) => {
    setActiveMode('single');
  };

  const toggleLanguage = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <div
      dir={dir}
      className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-cyan-500 selection:text-neutral-950 font-sans"
    >
      {/* Top Studio Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 ring-1 ring-white/20 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>{t.appName}</span>
                  <span className="text-cyan-400 font-mono text-xs font-normal px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/50">
                    {t.appVersion}
                  </span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  {t.appBadge}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Status Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 font-mono text-xs text-neutral-400 bg-neutral-900/90 px-2.5 py-1 rounded-lg border border-neutral-800">
              <span className="text-neutral-400">{t.audioSpecBadge}</span>
            </div>

            {serverStatus && !serverStatus.hasApiKey && (
              <div className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-[10px] font-mono text-amber-300 flex items-center gap-1">
                <span>{t.localModeBadge}</span>
              </div>
            )}

            {/* Language Switcher Button */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-xl border border-neutral-700/80 bg-neutral-900/90 hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 text-neutral-200 hover:text-white transition-all shadow-sm active:scale-95"
              title={t.switchLanguage}
            >
              <Languages className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Info / Guide Modal Button */}
            <button
              onClick={() => setShowInfoModal(true)}
              className="p-2 rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              title={t.guideTitle}
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Master Output Deck & Visualizer (Always Accessible at the top for immediate monitoring) */}
        <section aria-label="Master Output Deck">
          <MasterDeck currentTake={currentTake} />
        </section>

        {/* Studio Mode Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-neutral-800 pb-3">
          {[
            {
              id: 'single',
              label: t.tabSingle,
              icon: Mic,
              badge: t.tabSingleBadge,
              desc: t.tabSingleDesc,
            },
            {
              id: 'multi',
              label: t.tabMulti,
              icon: Users,
              badge: t.tabMultiBadge,
              desc: t.tabMultiDesc,
            },
            {
              id: 'persona',
              label: t.tabPersona,
              icon: Sliders,
              badge: t.tabPersonaBadge,
              desc: t.tabPersonaDesc,
            },
            {
              id: 'browser',
              label: t.tabBrowser,
              icon: Laptop,
              badge: t.tabBrowserBadge,
              desc: t.tabBrowserDesc,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as StudioMode)}
                className={`px-3.5 py-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 relative ${
                  isActive
                    ? 'bg-neutral-900 border-cyan-500/70 text-white shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                    : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-neutral-100">{tab.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-cyan-300">
                      {tab.badge}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 hidden sm:block">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Studio Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Active Studio Workstation (Left 2 Columns) */}
          <div className="lg:col-span-2 bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
            {activeMode === 'single' && (
              <SingleSpeakerStudio
                onTakeGenerated={handleTakeGenerated}
                onFallbackRequested={handleFallbackRequested}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            )}

            {activeMode === 'multi' && (
              <DualSpeakerStudio
                onTakeGenerated={handleTakeGenerated}
                onFallbackRequested={handleFallbackRequested}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            )}

            {activeMode === 'persona' && (
              <VoicePersonaDesigner
                onTakeGenerated={handleTakeGenerated}
                onApplyPersonaToStudio={handleApplyPersonaToStudio}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            )}

            {activeMode === 'browser' && (
              <BrowserNativeStudio initialText={fallbackText} />
            )}
          </div>

          {/* Side Drawer: Session Takes History & Quick Reference (Right 1 Column) */}
          <div className="space-y-6">
            <SessionTakesDrawer
              takes={takes}
              activeTakeId={currentTake?.id || null}
              onSelectTake={handleSelectTake}
              onDeleteTake={handleDeleteTake}
              onClearAll={handleClearAllTakes}
            />

            {/* Quick Reference Guide Card */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 text-xs space-y-3">
              <h5 className="font-semibold text-neutral-200 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.cheatsheetTitle}</span>
              </h5>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">&lt;breath&gt;</span> {t.breathDesc}
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">&lt;laugh&gt;</span> {t.laughDesc}
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">&lt;gasp&gt;</span> {t.gaspDesc}
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">&lt;sigh&gt;</span> {t.sighDesc}
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">|yeah|</span> {t.yeahDesc}
                </div>
                <div className="p-1.5 bg-neutral-950 rounded border border-neutral-800/80 text-neutral-300">
                  <span className="text-cyan-400">|mhm|</span> {t.mhmDesc}
                </div>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                {t.cheatsheetDesc}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Info & Syntax Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">{t.modalTitle}</h3>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-300 leading-relaxed max-h-[70vh] overflow-y-auto pr-2">
              <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl space-y-1">
                <h4 className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.modalArabicTipsTitle}</span>
                </h4>
                <p className="text-neutral-300 leading-relaxed">
                  {t.modalArabicTipsDesc}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">{t.modalSection1Title}</h4>
                <p className="text-neutral-400 whitespace-pre-line leading-relaxed">
                  {t.modalSection1Desc}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">{t.modalSection2Title}</h4>
                <p className="text-neutral-400 whitespace-pre-line leading-relaxed">
                  {t.modalSection2Desc}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">{t.modalSection3Title}</h4>
                <p className="text-neutral-400 leading-relaxed">
                  {t.modalSection3Desc}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-1">{t.modalSection4Title}</h4>
                <p className="text-neutral-400 leading-relaxed">
                  {t.modalSection4Desc}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/20"
              >
                {t.modalClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <StudioMain />
    </LanguageProvider>
  );
}
