import { React, html } from './runtime.js';
import { rawData } from './data.js';
import { mapTopicToTheme, processChapter } from './utils.js';
import { TopicEmoji } from './types.js';
import Sidebar from './components/Sidebar.js';
import SupportPopup from './components/SupportPopup.js';
import MediaSlider from './components/MediaSlider.js';
import SearchResultsModal from './components/SearchResultsModal.js';
import BooksPopup from './components/BooksPopup.js';
import { NavigationProvider, useNavigation } from './NavigationContext.js';
import IndexChapter from './components/IndexChapter.js';

const headerBackgroundDataUri =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="headerGrid" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#ffffff"/>
          <path d="M26 0H0V26" fill="none" stroke="rgba(0,0,0,0.05)" stroke-width="1"/>
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
  const [isFilterMenuOpen, setIsFilterMenuOpen] = React.useState(false);
  const { incrementInteraction, searchQuery, setSearchQuery, debouncedSearchQuery } = useNavigation();

  React.useEffect(() => {
    const processed = rawData.map(processChapter).filter(Boolean);
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
    setIsSearchOverlayOpen(false);
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


  const chaptersForIndex = React.useMemo(() => {
    const query = debouncedSearchQuery.trim().toLowerCase();
    const toLower = (value) => (typeof value === 'string' ? value.toLowerCase() : '');
    const includesQuery = (value) => toLower(value).includes(query);

    return filteredData
      .map((chapter) => {
        const matchesChapterTitle =
          !query ||
          includesQuery(chapter.cleanTitle) ||
          includesQuery(chapter.subtitle) ||
          (chapter.keypoints || []).some((point) => includesQuery(point));

        const subchapters = (chapter.processedSubchapters || []).filter((sub) => {
          if (!query) return true;
          return (
            includesQuery(sub.cleanTitle) ||
            includesQuery(sub.content) ||
            includesQuery(sub.summary)
          );
        });

        if (query && !matchesChapterTitle && subchapters.length === 0) return null;

        return {
          ...chapter,
          processedSubchapters: subchapters.length > 0 || query ? subchapters : chapter.processedSubchapters
        };
      })
      .filter(Boolean);
  }, [debouncedSearchQuery, filteredData]);

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

    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <header
        className="brutal-card mobile-unboxed accent-bar accent-blue flex flex-col items-center justify-center gap-6 text-center no-round"
        style=${{
          backgroundImage: `url(${headerBackgroundDataUri})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="w-full">
          <h1 className="pixel-title ff-hero text-center">FUTURO FORTISSIMO</h1>
        </div>
      </header>

      <section className="brutal-card mobile-unboxed accent-bar accent-yellow no-round space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 items-start">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value=${searchQuery}
                  onInput=${handleSearchChange}
                  placeholder="Cerca storie..."
                  className="w-full px-4 py-3 pr-20 bg-white border-3 border-black ff-input placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  aria-label="Cerca storie"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button
                    type="button"
                    className="text-black text-lg"
                    aria-label="Apri menu filtri"
                    onClick=${() => setIsFilterMenuOpen(true)}
                  >
                    🔍
                  </button>
                  ${searchQuery
                    ? html`<button
                        type="button"
                        className="text-black text-lg"
                        aria-label="Pulisci ricerca"
                        onClick=${handleClearSearch}
                      >
                        ✕
                      </button>`
                    : null}
                </div>
              </div>
            <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
              <button
                type="button"
                onClick=${handleOpenMedia}
                className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform"
              >
                🎥 Media
              </button>
              <button
                type="button"
                onClick=${handleOpenBooks}
                disabled=${bookSuggestions.length === 0}
                className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
              >
                📚 Libri
              </button>
              <a
                href="./book/"
                className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform"
              >
                📖 Libro
              </a>
              <a
                href="https://www.paypal.com/paypalme/MicheleMerelli"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Supporto PayPal"
                className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow ff-button hover:-translate-y-1 transition-transform"
              >
                ☕
              </a>
              <a
                href="https://micmer-git.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Progetti micmer"
                className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow ff-button hover:-translate-y-1 transition-transform"
              >
                M
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:hidden">
              <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
            </div>
          </div>
        </div>
      </section>

      <section id="indice" className="compact-index space-y-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="ff-eyebrow-md text-black/80">Indice</div>
            <span aria-hidden="true" className="text-black/60">·</span>
            ${selectedEmoji
              ? html`<button
                  className="ff-button border-3 border-black px-3 py-2 bg-[var(--ff-yellow)] brutal-shadow"
                  onClick=${() => handleTopicSelect(null)}
                >
                  Clear ${selectedEmoji}
                </button>`
              : html`<span className="ff-eyebrow-md text-black/70">Tutti i temi</span>`}
          </div>

          <div className="space-y-6">
            ${chaptersForIndex.length > 0
              ? chaptersForIndex.map((chapter, index) =>
                  html`<${IndexChapter}
                    key=${`${chapter.url}-${index}`}
                    chapter=${chapter}
                    highlight=${debouncedSearchQuery}
                  />`
                )
              : html`<div className="border-3 border-black p-10 text-center brutal-shadow">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="ff-body mb-4">Nessun risultato per questo filtro.</p>
                  <button
                    onClick=${() => handleTopicSelect(null)}
                    className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform"
                  >
                    Azzera filtri
                  </button>
                </div>`}
          </div>
        </div>
      </section>
    </div>

    ${isMediaOpen
      ? html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-label="Media deck" className="relative max-w-5xl w-full">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick=${handleCloseMedia}
                className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform"
              >
                Chiudi media
              </button>
            </div>
            <${MediaSlider} chapters=${processedData} />
          </div>
        </div>`
      : null}

    ${isFilterMenuOpen
      ? html`<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end lg:hidden">
          <div className="w-72 max-w-full bg-white border-l-4 border-black p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="ff-eyebrow text-black/80">Filtri</div>
              <button
                type="button"
                aria-label="Chiudi filtri"
                className="text-lg font-bold"
                onClick=${() => setIsFilterMenuOpen(false)}
              >
                ✕
              </button>
            </div>
            <${Sidebar}
              selectedEmoji=${selectedEmoji}
              onSelect=${(emoji) => {
                handleTopicSelect(emoji);
                setIsFilterMenuOpen(false);
              }}
              vertical=${true}
            />
          </div>
        </div>`
      : null}
  </div>`;
};

const App = () => html`<${NavigationProvider}><${InnerApp} /><//>`;

export default App;
