import {
  ListMusic,
  Play,
  Download,
  Trash2,
  Clock,
  Sparkles
} from 'lucide-react';
import { SessionTake } from '../types/tts';
import { useLanguage } from '../i18n/LanguageContext';

interface SessionTakesDrawerProps {
  takes: SessionTake[];
  activeTakeId: string | null;
  onSelectTake: (take: SessionTake) => void;
  onDeleteTake: (id: string) => void;
  onClearAll: () => void;
}

export function SessionTakesDrawer({
  takes,
  activeTakeId,
  onSelectTake,
  onDeleteTake,
  onClearAll,
}: SessionTakesDrawerProps) {
  const { t } = useLanguage();

  const handleDownload = (e: React.MouseEvent, take: SessionTake) => {
    e.stopPropagation();
    const byteCharacters = atob(take.audioWavBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Support Arabic letters and unicode in filename
    const safeTitle = take.title.replace(/[^\p{L}\p{N}]/gu, '-').slice(0, 40) || 'voxstudio-take';
    a.download = `${safeTitle}-${take.timestamp}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-neutral-900/80 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ListMusic className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-neutral-100 flex items-center gap-2">
              <span>{t.takesDrawerTitle}</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded-full bg-neutral-800 text-cyan-400 border border-neutral-700">
                {takes.length}
              </span>
            </h4>
          </div>
        </div>

        {takes.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[11px] text-neutral-400 hover:text-rose-400 font-mono transition-colors"
          >
            {t.takesClearAll}
          </button>
        )}
      </div>

      {takes.length === 0 ? (
        <div className="py-8 text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-full bg-neutral-800/60 flex items-center justify-center text-neutral-500 border border-neutral-700/50">
            <Sparkles className="w-5 h-5 text-neutral-500" />
          </div>
          <p className="text-xs text-neutral-400 font-medium">{t.takesEmptyTitle}</p>
          <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {t.takesEmptyDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {takes.map((take) => {
            const isActive = activeTakeId === take.id;
            return (
              <div
                key={take.id}
                onClick={() => onSelectTake(take)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-cyan-500/10 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                    : 'bg-neutral-950/70 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/60'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-mono mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-neutral-800 text-cyan-300">
                      {take.voiceName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTime(take.timestamp)}
                    </span>
                    <span>•</span>
                    <span className="text-neutral-300">
                      {take.durationSeconds ? `${take.durationSeconds}s` : ''}
                    </span>
                  </div>

                  <h5 className="text-xs font-semibold text-neutral-200 truncate">
                    {take.title}
                  </h5>

                  <p className="text-[11px] text-neutral-500 truncate mt-0.5 font-sans">
                    {take.textSnippet}
                  </p>
                </div>

                {/* Quick item actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => handleDownload(e, take)}
                    title={t.takesDownload}
                    className="p-1.5 rounded-lg border border-neutral-800 hover:border-cyan-500 bg-neutral-900 hover:bg-cyan-500/20 text-neutral-400 hover:text-cyan-300 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTake(take.id);
                    }}
                    title={t.takesDelete}
                    className="p-1.5 rounded-lg border border-neutral-800 hover:border-rose-500 bg-neutral-900 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
