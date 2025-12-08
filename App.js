import { React, html } from './runtime.js';
import { rawData } from './data.js';
import { mapTopicToTheme, processChapter } from './utils.js';
import { TopicEmoji } from './types.js';
import ChapterItem from './components/ChapterItem.js';
import Sidebar from './components/Sidebar.js';
import RightSidebar from './components/RightSidebar.js';
import SupportPopup from './components/SupportPopup.js';
import MediaSlider from './components/MediaSlider.js';
import SearchResultsModal from './components/SearchResultsModal.js';
import BooksPopup from './components/BooksPopup.js';
import { NavigationProvider, useNavigation } from './NavigationContext.js';

const titleImageDataUri =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg width="740" height="160" viewBox="0 0 740 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Futuro Fortissimo">
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'IBM Plex Mono','Inter',monospace" font-size="56" font-weight="700" letter-spacing="3.5" fill="#0a0a0a">
        Futuro Fortissimo
      </text>
    </svg>
  `);

const headerBackgroundDataUri =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="headerGrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#ffffff"/>
          <path d="M26 0H0V26" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>
        </pattern>
        <linearGradient id="bottomHue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#c8e6ff" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#ffd6ec" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="360" fill="url(#headerGrid)"/>
      <rect y="360" width="1200" height="240" fill="url(#bottomHue)"/>
      <circle cx="240" cy="220" r="110" fill="#c8e6ff" fill-opacity="0.35"/>
      <circle cx="820" cy="160" r="140" fill="#ffd6ec" fill-opacity="0.3"/>
      <circle cx="620" cy="440" r="170" fill="#c8e6ff" fill-opacity="0.25"/>
      <circle cx="1040" cy="420" r="120" fill="#ffd6ec" fill-opacity="0.2"/>
    </svg>
  `);

const extractBooksFromData = (chapters = []) => {
  const seen = new Set();
  const books = [];

  chapters.forEach((chapter) => {
    chapter.processedSubchapters.forEach((sub) => {
      const quote = (sub.content || '')
        .split('\n')
        .find((paragraph) => paragraph && paragraph.trim())
        ?.trim();
      const image = Array.isArray(sub.images) && sub.images.length > 0 ? sub.images[0].src : null;

      [...(sub.references || []), ...(sub.connections || [])].forEach((ref) => {
        if (!ref?.url || !ref.url.includes('amzn.to')) return;
        const key = ref.url;
        if (seen.has(key)) return;
        seen.add(key);

        const title = (ref.text || sub.cleanTitle || 'Consiglio di lettura').trim();
        if (!title || title === '.') return;

        books.push({
          id: key,
          title,
          link: ref.url,
          chapterTitle: chapter.cleanTitle,
          subTitle: sub.cleanTitle,
          image,
          quote,
          chapterUrl: chapter.url,
          subLink: sub.link
        });
      });
    });
  });

  return books;
};

const InnerApp = () => {
  const [processedData, setProcessedData] = React.useState([]);
  const [selectedEmoji, setSelectedEmoji] = React.useState(null);
  const [isMediaOpen, setIsMediaOpen] = React.useState(false);
  const [isBooksOpen, setIsBooksOpen] = React.useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = React.useState(false);
  const [hasManuallyClosedSearch, setHasManuallyClosedSearch] = React.useState(false);
  const [visibleChapterIndex, setVisibleChapterIndex] = React.useState(0);
  const touchStartRef = React.useRef(null);
  const { incrementInteraction, searchQuery, setSearchQuery } = useNavigation();

  React.useEffect(() => {
    const processed = rawData.map(processChapter);
    setProcessedData(processed);
  }, []);

  const bookSuggestions = React.useMemo(() => extractBooksFromData(processedData), [processedData]);

  const doesSubchapterMatchSelection = React.useCallback(
    (sub, emoji) => {
      if (!emoji) return true;

      const targetTheme = mapTopicToTheme(emoji);
      if (targetTheme) {
        return mapTopicToTheme(sub.secondaryEmoji) === targetTheme;
      }

      return sub.secondaryEmoji === emoji;
    },
    []
  );

  const filteredData = React.useMemo(() => {
    if (!selectedEmoji) return processedData;

    return processedData
      .map((chapter) => {
        const matchingSubchapters = chapter.processedSubchapters.filter((sub) =>
          doesSubchapterMatchSelection(sub, selectedEmoji)
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

  React.useEffect(() => {
    if (filteredData.length === 0) return;
    setVisibleChapterIndex(Math.floor(Math.random() * filteredData.length));
  }, [filteredData]);

  const showRandomChapter = React.useCallback(() => {
    if (!filteredData.length) return;

    setVisibleChapterIndex((prev) => {
      if (filteredData.length === 1) return 0;

      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * filteredData.length);
      }
      return next;
    });
  }, [filteredData.length]);

  const handleTopicSelect = (emoji) => {
    incrementInteraction();
    setSelectedEmoji(emoji);

    if (emoji === TopicEmoji.BOOK) {
      setIsBooksOpen(true);
    } else {
      setIsBooksOpen(false);
    }
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
  const handleOpenBooks = () => {
    setSelectedEmoji(TopicEmoji.BOOK);
    setIsBooksOpen(true);
  };
  const handleCloseBooks = () => {
    setIsBooksOpen(false);
    if (selectedEmoji === TopicEmoji.BOOK) {
      setSelectedEmoji(null);
    }
  };

  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 50) {
      showRandomChapter();
    }
  };

  const safeVisibleIndex = React.useMemo(() => {
    if (!filteredData.length) return 0;
    return Math.min(visibleChapterIndex, filteredData.length - 1);
  }, [filteredData.length, visibleChapterIndex]);

  const chaptersToRender = React.useMemo(() => {
    if (!filteredData.length) return [];
    return [filteredData[safeVisibleIndex]];
  }, [filteredData, safeVisibleIndex]);

  return html`<div className="min-h-screen text-black selection:bg-yellow-200 selection:text-black">
    <${SupportPopup} />
    <${SearchResultsModal}
      chapters=${processedData}
      isOpen=${isSearchOverlayOpen}
      onHide=${handleHideSearchOverlay}
      onClear=${handleClearSearch}
      onNavigate=${handleHideSearchOverlay}
    />
    <${BooksPopup} isOpen=${isBooksOpen} onClose=${handleCloseBooks} books=${bookSuggestions} />

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 space-y-10">
      <header
        className="brutal-card mobile-unboxed accent-bar accent-blue flex flex-col md:flex-row justify-between items-start gap-4 no-round"
        style=${{
          backgroundImage: `url(${headerBackgroundDataUri})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-full">
          <img
            src=${titleImageDataUri}
            alt="Futuro Fortissimo"
            loading="lazy"
            className="w-full max-w-[580px]"
          />
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
          <a
            href="https://micmer-git.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Progetti micmer"
            className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
          >
            M
          </a>
        </div>
      </header>

      <section className="brutal-card mobile-unboxed accent-bar accent-yellow no-round space-y-6">
        <div className="grid grid-cols-1 gap-6 items-start">
          <div className="flex flex-col gap-4">
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
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick=${handleOpenMedia}
                className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
              >
                Media
              </button>
              <button
                type="button"
                onClick=${handleOpenBooks}
                disabled=${bookSuggestions.length === 0}
                className="px-4 py-3 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Libri
              </button>
              <a
                href="#indice"
                className="px-4 py-3 border-3 border-black bg-[var(--ff-yellow)] brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
              >
                Indice
              </a>
            </div>
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

            <div className="flex justify-center lg:hidden">
              <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
            </div>
          </div>
        </div>
      </section>

      <section className="brutal-card mobile-unboxed no-round">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr_320px] gap-6 items-start">
          <div className="hidden lg:block sticky top-6">
            <div className="border-3 border-black bg-white p-3">
              <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${true} />
            </div>
          </div>

          <div className="flex-1 space-y-6" onTouchStart=${handleTouchStart} onTouchEnd=${handleTouchEnd}>
            <div className="border-3 border-black p-3 bg-white flex flex-col gap-3 md:flex-row md:items-center md:justify-between sticky top-4 z-10">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-heading text-sm">Archivio</div>
                <span aria-hidden="true" className="text-black/60">
                  ·
                </span>
                ${selectedEmoji
                  ? html`<button
                      className="font-heading text-xs uppercase tracking-[0.2em] border-3 border-black px-3 py-2 bg-[var(--ff-yellow)] brutal-shadow"
                      onClick=${() => handleTopicSelect(null)}
                    >
                      Clear ${selectedEmoji}
                    </button>`
                  : html`<span className="font-heading text-xs uppercase tracking-[0.2em]">Tutti i temi</span>`}
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-end">
                ${filteredData.length > 1
                  ? html`<div className="flex gap-2" aria-label="Capitolo casuale">
                      <button
                        type="button"
                        onClick=${showRandomChapter}
                        className="px-3 py-2 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
                      >
                        ←
                      </button>
                      <button
                        type="button"
                        onClick=${showRandomChapter}
                        className="px-3 py-2 border-3 border-black bg-white brutal-shadow font-heading text-xs uppercase tracking-[0.2em] hover:-translate-y-1 transition-transform"
                      >
                        →
                      </button>
                    </div>`
                  : null}
              </div>
            </div>

            <div className="space-y-8">
              ${chaptersToRender.length > 0
                ? chaptersToRender.map((chapter, index) => html`<${ChapterItem} key=${`${chapter.url}-${index}`} chapter=${chapter} />`)
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

          <div id="indice" className="hidden lg:block border-3 border-black bg-white p-4 sticky top-6">
            <${RightSidebar} chapters=${filteredData} />
          </div>
        </div>
      </section>

      <div className="lg:hidden brutal-card mobile-unboxed no-round">
        <${RightSidebar} chapters=${filteredData} isMobileMode=${true} />
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
