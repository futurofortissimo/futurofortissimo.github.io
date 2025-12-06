import { React, html } from './runtime.js';
import { rawData } from './data.js';
import { processChapter } from './utils.js';
import ChapterItem from './components/ChapterItem.js';
import Sidebar from './components/Sidebar.js';
import RightSidebar from './components/RightSidebar.js';
import SupportPopup from './components/SupportPopup.js';
import MediaSlider from './components/MediaSlider.js';
import { NavigationProvider, useNavigation } from './NavigationContext.js';

const InnerApp = () => {
  const [processedData, setProcessedData] = React.useState([]);
  const [selectedEmoji, setSelectedEmoji] = React.useState(null);
  const [isMediaOpen, setIsMediaOpen] = React.useState(false);
  const { incrementInteraction } = useNavigation();

  React.useEffect(() => {
    const processed = rawData.map(processChapter);
    setProcessedData(processed);
  }, []);

  const filteredData = React.useMemo(() => {
    if (!selectedEmoji) return processedData;

    return processedData
      .map((chapter) => {
        const matchingSubchapters = chapter.processedSubchapters.filter(
          (sub) => sub.secondaryEmoji === selectedEmoji
        );

        if (matchingSubchapters.length > 0) {
          return {
            ...chapter,
            processedSubchapters: matchingSubchapters
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [processedData, selectedEmoji]);

  const handleTopicSelect = (emoji) => {
    incrementInteraction();
    setSelectedEmoji(emoji);
  };

  const handleOpenMedia = () => {
    incrementInteraction();
    setIsMediaOpen(true);
  };

  const handleCloseMedia = () => setIsMediaOpen(false);

  return html`<div className="min-h-screen text-black selection:bg-yellow-200 selection:text-black">
    <${SupportPopup} />

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header className="brutal-card accent-bar accent-blue flex flex-col md:flex-row justify-between items-start gap-4 no-round">
        <div>
          <p className="mono-label text-xs text-black">Mic Mer Archive</p>
          <h1 className="text-4xl md:text-5xl font-heading font-black leading-none">Futuro Fortissimo</h1>
          <p className="mt-3 text-base max-w-2xl">Brutalist, technical, retro. Un archivio cronologico di idee, media e collegamenti sul futuro sostenibile.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick=${() => handleTopicSelect(null)}
            className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
          >
            Reset filtri
          </button>
          <button
            onClick=${() => incrementInteraction()}
            className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
          >
            Supporto
          </button>
        </div>
      </header>

      <section className="brutal-card no-round">
        <div className="grid grid-cols-1 lg:grid-cols-[140px_1fr_320px] gap-6 items-start">
          <div className="hidden lg:block">
            <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${true} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="lg:hidden">
              <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
            </div>

            <div className="border-3 border-black p-3 bg-white flex items-center justify-between">
              <div className="font-heading text-sm">Archivio • ${filteredData.length} capitoli</div>
              ${selectedEmoji
                ? html`<button
                    className="font-heading text-xs uppercase tracking-[0.2em] border-3 border-black px-3 py-2 bg-[var(--ff-yellow)] brutal-shadow"
                    onClick=${() => handleTopicSelect(null)}
                  >
                    Clear ${selectedEmoji}
                  </button>`
                : html`<span className="font-heading text-xs uppercase tracking-[0.2em]">Tutti i temi</span>`}
            </div>

            <div className="space-y-8">
              ${filteredData.length > 0
                ? filteredData.map((chapter, index) => html`<${ChapterItem} key=${`${chapter.url}-${index}`} chapter=${chapter} />`)
                : html`<div className="border-3 border-black p-10 text-center brutal-shadow">
                    <span className="text-5xl block mb-4">🔍</span>
                    <p className="text-lg mb-4">Nessun risultato per questo filtro.</p>
                    <button
                      onClick=${() => handleTopicSelect(null)}
                      className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
                    >
                      Azzera filtri
                    </button>
                  </div>`}
            </div>
          </div>

          <div className="hidden lg:block border-3 border-black bg-white p-4">
            <${RightSidebar} chapters=${filteredData} onOpenMedia=${handleOpenMedia} />
          </div>
        </div>
      </section>

      <div className="lg:hidden brutal-card no-round">
        <${RightSidebar} chapters=${filteredData} isMobileMode=${true} onOpenMedia=${handleOpenMedia} />
      </div>
    </div>

    ${isMediaOpen
      ? html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-label="Media deck" className="relative max-w-5xl w-full">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick=${handleCloseMedia}
                className="px-4 py-2 border-3 border-black bg-white font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
              >
                Chiudi media
              </button>
            </div>
            <${MediaSlider} chapters=${processedData} />
          </div>
        </div>`
      : null}
  </div>`;
};

const App = () => html`<${NavigationProvider}><${InnerApp} /><//>`;

export default App;
