import { React, html } from './runtime.js';
import { rawData } from './data.js';
import { processChapter } from './utils.js';
import ChapterItem from './components/ChapterItem.js';
import RightSidebar from './components/RightSidebar.js';
import SupportPopup from './components/SupportPopup.js';
import MediaSlider from './components/MediaSlider.js';
import SearchResultsModal from './components/SearchResultsModal.js';
import { NavigationProvider, useNavigation } from './NavigationContext.js';
import BooksModal from './components/BooksModal.js';

const InnerApp = () => {
  const [processedData, setProcessedData] = React.useState([]);
  const [currentChapterIndex, setCurrentChapterIndex] = React.useState(0);
  const [isMediaOpen, setIsMediaOpen] = React.useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = React.useState(false);
  const [hasManuallyClosedSearch, setHasManuallyClosedSearch] = React.useState(false);
  const [isBooksModalOpen, setIsBooksModalOpen] = React.useState(false);
  const touchStartX = React.useRef(null);
  const chapterIndexMap = React.useRef({});
  const { incrementInteraction, searchQuery, setSearchQuery, isMobileMenuOpen, setIsMobileMenuOpen } = useNavigation();

  React.useEffect(() => {
    const processed = rawData.map(processChapter);
    setProcessedData(processed);
    chapterIndexMap.current = processed.reduce((acc, chapter, index) => {
      acc[chapter.url] = index;
      return acc;
    }, {});
    if (processed.length > 0) {
      setCurrentChapterIndex(Math.floor(Math.random() * processed.length));
    }
  }, []);

  const currentChapter = processedData[currentChapterIndex] || null;

  const bookSections = React.useMemo(() => {
    return processedData
      .map((chapter) =>
        chapter.processedSubchapters
          .filter((sub) => sub.mentionsBook)
          .map((sub) => ({
            chapterTitle: chapter.cleanTitle,
            chapterUrl: chapter.url,
            subchapterTitle: sub.cleanTitle,
            subchapterLink: sub.link,
            references: sub.references || [],
            images: sub.images || [],
            quote: sub.content.split('\n').find((paragraph) => paragraph.trim()) || '',
            secondaryEmoji: sub.secondaryEmoji
          }))
      )
      .flat();
  }, [processedData]);

  const handleNavigateToChapter = React.useCallback(
    (chapterUrl) => {
      const targetIndex = chapterIndexMap.current[chapterUrl];
      if (typeof targetIndex === 'number') {
        setCurrentChapterIndex(targetIndex);
      }
    },
    []
  );

  const handleNextChapter = React.useCallback(() => {
    setCurrentChapterIndex((prev) => (processedData.length > 0 ? (prev + 1) % processedData.length : prev));
  }, [processedData.length]);

  const handlePreviousChapter = React.useCallback(() => {
    setCurrentChapterIndex((prev) => (processedData.length > 0 ? (prev - 1 + processedData.length) % processedData.length : prev));
  }, [processedData.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    const threshold = 60;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handlePreviousChapter();
      } else {
        handleNextChapter();
      }
    }

    touchStartX.current = null;
  };

  const handleSearchChange = (e) => {
    setHasManuallyClosedSearch(false);
    setSearchQuery(e.target.value);
  };

  React.useEffect(() => {
    if (searchQuery.trim()) {
      if (!hasManuallyClosedSearch) {
        setIsSearchOverlayOpen(true);
      }
    } else {
      setIsSearchOverlayOpen(false);
      setHasManuallyClosedSearch(false);
    }
  }, [searchQuery, hasManuallyClosedSearch]);

  const handleHideSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
    setHasManuallyClosedSearch(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setHasManuallyClosedSearch(false);
  };

  const handleShowSearchOverlay = () => {
    if (searchQuery.trim()) {
      setHasManuallyClosedSearch(false);
      setIsSearchOverlayOpen(true);
    }
  };

  const handleOpenMedia = () => {
    incrementInteraction();
    setIsMediaOpen(true);
  };

  const handleCloseMedia = () => setIsMediaOpen(false);

  const handleToggleIndex = () => setIsMobileMenuOpen((prev) => !prev);

  return html`<div className="min-h-screen text-black selection:bg-yellow-200 selection:text-black">
    <${SupportPopup} />
    <${SearchResultsModal}
      chapters=${processedData}
      isOpen=${isSearchOverlayOpen}
      onHide=${handleHideSearchOverlay}
      onClear=${handleClearSearch}
      onNavigate=${handleHideSearchOverlay}
      onNavigateToSection=${(sectionId, chapterId) => {
        handleNavigateToChapter(chapterId);
        handleHideSearchOverlay();
        requestAnimationFrame(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      }}
    />

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header className="brutal-card mobile-unboxed accent-bar accent-blue flex flex-col md:flex-row justify-between items-start gap-4 no-round">
        <div>
          <h1 className="text-4xl md:text-5xl font-heading font-black leading-none">Futuro Fortissimo</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.paypal.com/paypalme/MicheleMerelli"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Supporto PayPal"
            className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
          >
            ☕
          </a>
        </div>
      </header>

      <section className="brutal-card mobile-unboxed accent-bar accent-yellow no-round">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/2 flex flex-col gap-3 md:ml-auto">
            <div className="relative">
              <input
                type="text"
                value=${searchQuery}
                onInput=${handleSearchChange}
                placeholder="Cerca storie..."
                className="w-full px-4 py-3 pr-12 bg-white border-3 border-black font-heading uppercase tracking-[0.15em] placeholder:text-gray-400 focus:outline-none focus:ring-0"
                aria-label="Cerca storie"
              />
              <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-black">🔍</span>
            </div>
            <button
              type="button"
              onClick=${handleOpenMedia}
              className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
            >
              Apri media
            </button>
            ${bookSections.length > 0
              ? html`<button
                  type="button"
                  onClick=${() => setIsBooksModalOpen(true)}
                  className="px-4 py-3 border-3 border-black bg-[var(--ff-yellow)] brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform flex items-center gap-2"
                >
                  <span aria-hidden="true">📚</span> Sezioni libro
                </button>`
              : null}
            ${searchQuery
              ? html`<div className="flex flex-wrap gap-2">
                  ${!isSearchOverlayOpen
                    ? html`<button
                        type="button"
                        onClick=${handleShowSearchOverlay}
                        className="px-3 py-2 border-3 border-black bg-white brutal-shadow font-heading text-[11px] uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                      >
                        Mostra risultati
                      </button>`
                    : null}
                  <button
                    type="button"
                    onClick=${handleClearSearch}
                    className="px-3 py-2 border-3 border-black bg-[var(--ff-yellow)] brutal-shadow font-heading text-[11px] uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                  >
                    Svuota ricerca
                  </button>
                </div>`
              : null}
          </div>
        </div>
      </section>

      <section
        className="brutal-card mobile-unboxed no-round"
        onTouchStart=${handleTouchStart}
        onTouchEnd=${handleTouchEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="flex-1 space-y-6">
            <div className="border-3 border-black p-3 bg-white flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-heading text-xs uppercase tracking-[0.2em]">Esplora Futuro Fortissimo</div>
                <div className="text-base md:text-lg font-heading font-black">${processedData.length} capitoli • swipe o usa le frecce</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick=${handlePreviousChapter}
                  className="px-3 py-2 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                  aria-label="Capitolo precedente"
                >
                  ←
                </button>
                <div className="px-3 py-2 border-3 border-black bg-[var(--ff-yellow)] font-heading text-xs uppercase tracking-[0.2em]">
                  ${currentChapter ? currentChapter.cleanTitle : 'Caricamento…'}
                </div>
                <button
                  type="button"
                  onClick=${handleNextChapter}
                  className="px-3 py-2 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                  aria-label="Capitolo successivo"
                >
                  →
                </button>
              </div>
            </div>

            <div className="space-y-8">
              ${currentChapter
                ? html`<${ChapterItem} key=${currentChapter.url} chapter=${currentChapter} />`
                : html`<div className="border-3 border-black p-10 text-center brutal-shadow">
                    <span className="text-5xl block mb-4">⏳</span>
                    <p className="text-lg mb-4">Carico un capitolo casuale…</p>
                  </div>`}
            </div>
          </div>

          <div className="hidden lg:block border-3 border-black bg-white p-4">
            <${RightSidebar} chapters=${currentChapter ? [currentChapter] : []} onOpenMedia=${handleOpenMedia} />
          </div>
        </div>
      </section>
    </div>

    <div className="fixed bottom-4 right-4 flex flex-col gap-2 md:hidden z-40">
      <button
        type="button"
        onClick=${() => {
          handleShowSearchOverlay();
          const searchInput = document.querySelector('input[aria-label="Cerca storie"]');
          if (searchInput) {
            searchInput.focus();
          }
        }}
        className="h-12 w-12 rounded-full border-3 border-black bg-white brutal-shadow text-xl"
        aria-label="Apri ricerca"
      >
        🔍
      </button>
      <button
        type="button"
        onClick=${handleOpenMedia}
        className="h-12 w-12 rounded-full border-3 border-black bg-white brutal-shadow text-xl"
        aria-label="Apri media"
      >
        🎞️
      </button>
      <button
        type="button"
        onClick=${handleToggleIndex}
        className=${`h-12 w-12 rounded-full border-3 border-black brutal-shadow text-xl ${
          isMobileMenuOpen ? 'bg-[var(--ff-blue)]' : 'bg-white'
        } ${processedData.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
        aria-label="Apri indice"
      >
        📑
      </button>
    </div>

    ${isMobileMenuOpen
      ? html`<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl">
            <button
              type="button"
              className="absolute top-2 right-2 px-3 py-2 border-3 border-black bg-white font-heading text-xs uppercase tracking-[0.2em] brutal-shadow"
              onClick=${handleToggleIndex}
            >
              Chiudi indice
            </button>
            <div className="brutal-card no-round bg-white max-h-[80vh] overflow-y-auto">
              <${RightSidebar}
                chapters=${currentChapter ? [currentChapter] : []}
                isMobileMode=${true}
                onOpenMedia=${handleOpenMedia}
              />
            </div>
          </div>
        </div>`
      : null}

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

    ${isBooksModalOpen
      ? html`<${BooksModal} sections=${bookSections} onClose=${() => setIsBooksModalOpen(false)} />`
      : null}
  </div>`;
};

const App = () => html`<${NavigationProvider}><${InnerApp} /><//>`;

export default App;
