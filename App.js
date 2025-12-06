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

  return html`<div className="min-h-screen text-black selection:bg-yellow-200 selection:text-black">
    <${SupportPopup} />

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header className="brutal-card accent-bar accent-blue flex flex-col md:flex-row justify-between items-start gap-4 no-round">
        <div>
          <p className="mono-label text-xs text-black">Mic Mer Archive</p>
          <h1 className="text-4xl md:text-5xl font-heading font-black leading-none">Futuro Fortissimo</h1>
          <p className="mt-3 text-base max-w-2xl">Brutalist, technical, retro. Un archivio cronologico di idee, media e collegamenti sul futuro sostenibile.</p>
        </div>
        <div className="flex gap-3">
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

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="brutal-card accent-bar accent-blue no-round">
          <div className="bg-[var(--ff-blue)] border-3 border-black p-3 flex items-center justify-between mb-4">
            <div className="bg-white border-3 border-black px-3 py-1 font-heading text-sm">Profile</div>
            <span className="font-heading text-xs tracking-[0.2em] text-white">Retro Computing Mood</span>
          </div>
          <div className="grid grid-cols-[140px_1fr] gap-6 items-start">
            <div className="border-3 border-black bg-white brutal-shadow h-36 flex items-center justify-center text-center">
              <span className="font-heading text-xl leading-tight">MIC<br />MER</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-3 border-black p-3 accent-bar accent-red no-round">
                <p className="mono-label text-[10px] text-black">Location</p>
                <p className="mt-2 font-heading text-lg flex items-center gap-2">📍 Bergamo</p>
              </div>
              <div className="border-3 border-black p-3 accent-bar accent-yellow no-round">
                <p className="mono-label text-[10px] text-black">Born</p>
                <p className="mt-2 font-heading text-lg flex items-center gap-2">📅 1990</p>
              </div>
              <div className="border-3 border-black p-3 accent-bar accent-green no-round">
                <p className="mono-label text-[10px] text-black">Email</p>
                <p className="mt-2 font-heading text-lg flex items-center gap-2">✉️ micmer@pm.me</p>
              </div>
              <div className="border-3 border-black p-3 accent-bar accent-blue no-round">
                <p className="mono-label text-[10px] text-black">MSC</p>
                <p className="mt-2 font-heading text-lg flex items-center gap-2">💻 PoliMi</p>
              </div>
            </div>
          </div>
        </section>

        <section className="brutal-card no-round">
          <p className="mono-label text-[10px] text-black mb-3">Social + Links</p>
          <div className="space-y-3">
            ${[
              { label: 'Newsletter', href: 'https://fortissimo.substack.com', icon: '➡️' },
              { label: 'WhatsApp', href: 'https://api.whatsapp.com/send?text=https://futurofortissimo.github.io', icon: '↗' },
              { label: 'Supporta', href: 'https://www.paypal.com/paypalme/michelemerelli', icon: '💙' },
              { label: 'English', href: 'https://futurofortissimo.github.io/ff_en.html', icon: 'EN' }
            ].map((item) => html`<a
                key=${item.label}
                href=${item.href}
                className="flex items-center justify-between border-3 border-black px-4 py-3 bg-white brutal-shadow hover:-translate-y-1 transition-transform no-round"
              >
                <span className="font-heading text-lg">${item.icon}</span>
                <span className="font-heading text-base flex-1 text-left ml-3">${item.label}</span>
                <span className="font-heading text-lg">→</span>
              </a>`)}
          </div>
        </section>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="brutal-card accent-bar accent-blue no-round flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-3 border-black flex items-center justify-center font-heading">📚</div>
            <div>
              <p className="mono-label text-[10px] text-black">Feature</p>
              <h3 className="font-heading text-2xl">Archive Stories</h3>
            </div>
          </div>
          <p className="text-sm">Cronologia di capitoli ff.x.y con filtri per emoji e ricerca diretta.</p>
        </div>
        <div className="brutal-card accent-bar accent-yellow no-round flex flex-col gap-2 relative">
          <span className="absolute right-3 top-2 mono-label text-[10px]">Knowledge Base</span>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-3 border-black flex items-center justify-center font-heading">🧠</div>
            <div>
              <p className="mono-label text-[10px] text-black">Feature</p>
              <h3 className="font-heading text-2xl">Connections</h3>
            </div>
          </div>
          <p className="text-sm">Ogni sottocapitolo porta a riferimenti e collegamenti incrociati.</p>
        </div>
        <div className="brutal-card accent-bar accent-green no-round flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border-3 border-black flex items-center justify-center font-heading">🛰️</div>
            <div>
              <p className="mono-label text-[10px] text-black">Feature</p>
              <h3 className="font-heading text-2xl">Media deck</h3>
            </div>
          </div>
          <p className="text-sm">Slider visivo randomizzato ispirato al mood tecnico neo-brutalista.</p>
        </div>
      </div>

      <section className="brutal-card no-round accent-bar accent-blue relative">
        <span className="absolute right-5 top-3 mono-label text-[10px]">Knowledge Base</span>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 border-3 border-black flex items-center justify-center font-heading">🗂️</div>
          <div className="flex-1">
            <h3 className="font-heading text-3xl leading-none">Futuro Fortissimo</h3>
            <p className="mt-2 text-sm max-w-2xl">Archivio digitale di storie, note e immagini che miscelano tecnologia, sostenibilità e comunità.</p>
          </div>
          <a href="https://futurofortissimo.github.io/" className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform">→ Apri</a>
        </div>
      </section>

      <section className="brutal-card no-round">
        <div className="grid lg:grid-cols-[140px_1fr_320px] gap-6 items-start">
          <div className="hidden lg:block">
            <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${true} />
          </div>

          <div className="flex-1 space-y-6">
            <div className="lg:hidden">
              <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
            </div>

            <div className="border-3 border-black p-3 bg-white brutal-shadow flex items-center justify-between">
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

            <${MediaSlider} chapters=${processedData} />

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

          <div className="hidden lg:block border-3 border-black bg-white brutal-shadow p-4">
            <${RightSidebar} chapters=${filteredData} />
          </div>
        </div>
      </section>

      <div className="lg:hidden brutal-card no-round">
        <${RightSidebar} chapters=${filteredData} isMobileMode=${true} />
      </div>
    </div>
  </div>`;
};

const App = () => html`<${NavigationProvider}><${InnerApp} /><//>`;

export default App;
