import { React, html } from './runtime.js';
import { rawData } from './data.js';
import { processChapter } from './utils.js';
import ChapterItem from './components/ChapterItem.js';
import Sidebar from './components/Sidebar.js';
import RightSidebar from './components/RightSidebar.js';
import SupportPopup from './components/SupportPopup.js';
import { NavigationProvider, useNavigation } from './NavigationContext.js';

const InnerApp = () => {
  const [processedData, setProcessedData] = React.useState([]);
  const [selectedEmoji, setSelectedEmoji] = React.useState(null);
  const { isMobileMenuOpen, setIsMobileMenuOpen, incrementInteraction } = useNavigation();

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

  return html`<div className="min-h-screen bg-white font-sans text-gray-900 relative selection:bg-yellow-200 selection:text-black">
    <${SupportPopup} />

    <div className="lg:hidden bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="px-4 py-3 flex justify-between items-center">
        <span
          className="font-heading font-bold text-xl tracking-tight cursor-pointer"
          onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Futuro Fortissimo
        </span>
        <button
          onClick=${() => setIsMobileMenuOpen(true)}
          className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors active:bg-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>
      </div>

      <div className="px-4 pb-3 overflow-x-auto no-scrollbar">
        <div className="flex w-max">
          <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
        </div>
      </div>
    </div>

    ${isMobileMenuOpen
      ? html`<div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" onClick=${() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-4 transform transition-transform animate-in slide-in-from-right duration-300 rounded-l-2xl border-l border-gray-100">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-lg">Search & Index</h2>
              <button onClick=${() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">✕</button>
            </div>
            <${RightSidebar} chapters=${filteredData} isMobileMode=${true} />
          </div>
        </div>`
      : null}

    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-0">
        <aside className="hidden lg:block w-20 shrink-0 pt-8 h-screen sticky top-0 z-20 pl-4">
          <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${true} />
        </aside>

        <main className="flex-1 min-w-0 pt-12 px-4 md:px-12 max-w-5xl mx-auto border-l border-r border-gray-50/50 min-h-screen">
          <header className="mb-16 pl-0 md:pl-[3.25rem]">
            <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-black mb-4 tracking-tighter leading-none">
              Futuro<br />Fortissimo
            </h1>
            <p className="text-lg text-gray-400 font-serif italic">
              A chronological archive of the future.
              ${selectedEmoji
                ? html`<span
                    className="not-italic ml-2 text-black bg-gray-100 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick=${() => handleTopicSelect(null)}
                  >
                    <span>${selectedEmoji}</span> Filter Active
                    <span className="hover:text-red-500">✕</span>
                  </span>`
                : null}
            </p>
          </header>

          <div className="space-y-12">
            ${filteredData.length > 0
              ? filteredData.map((chapter, index) => html`<${ChapterItem} key=${`${chapter.url}-${index}`} chapter=${chapter} />`)
              : html`<div className="py-32 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="text-6xl block mb-6 grayscale opacity-20">🔍</span>
                  <p className="text-xl text-gray-400 font-serif italic mb-6">No stories found for this topic.</p>
                  <button
                    onClick=${() => handleTopicSelect(null)}
                    className="px-6 py-2 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Clear all filters
                  </button>
                </div>`}
          </div>

          <footer className="mt-32 mb-16 pt-8 border-t border-gray-100 text-center text-gray-300 text-xs font-heading uppercase tracking-widest">
            Futuro Fortissimo Archive • Built with ❤️ & 🤖
          </footer>
        </main>

        <aside className="hidden xl:block w-80 shrink-0 pt-12 pr-8 h-screen sticky top-0 z-10">
          <${RightSidebar} chapters=${filteredData} />
        </aside>
      </div>
    </div>
  </div>`;
};

const App = () => html`<${NavigationProvider}><${InnerApp} /><//>`;

export default App;
