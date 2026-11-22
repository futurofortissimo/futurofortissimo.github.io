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
import { t, paths } from './i18n.js';

const NON_BOOK_SHORTCODES = new Set([
  '3yO5tEM',
  '4dHBHjX',
  '3Bjzz3x',
  '3yWFOcZ',
  '3UOT1N2',
  '3sUMQMj',
  '3Ggd13d'
]);

const ISSUE_RANGES = [
  { id: 'all', label: null, min: -1, max: 9999 },
  { id: '150+', label: 'ff.150+', min: 150, max: 9999 },
  { id: '120-149', label: 'ff.120–149', min: 120, max: 149 },
  { id: '90-119', label: 'ff.90–119', min: 90, max: 119 },
  { id: '1-89', label: 'ff.1–89', min: 1, max: 89 }
];


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
        const url = ref?.url || '';
        if (!/amzn\.to|amazon\./i.test(url) || url.includes('link.amazon/')) return;
        const sc = url.match(/amzn\.to\/([A-Za-z0-9]+)/i)?.[1];
        if (sc && NON_BOOK_SHORTCODES.has(sc)) return;

        const key = url;
        if (seen.has(key)) return;
        seen.add(key);

        const title = (ref.text || sub.cleanTitle || t('readingSuggestion')).trim();
        if (!title || title === '.') return;

        books.push({
          id: key,
          title,
          link: url,
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
  const [selectedRange, setSelectedRange] = React.useState('all');
  const [showPreviews, setShowPreviews] = React.useState(false);
  const [isMediaOpen, setIsMediaOpen] = React.useState(false);
  const [isBooksOpen, setIsBooksOpen] = React.useState(false);
  const [isSearchOverlayOpen, setIsSearchOverlayOpen] = React.useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = React.useState(false);

  const { incrementInteraction, searchQuery, setSearchQuery, debouncedSearchQuery } = useNavigation();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const initialQ = params.get('q');
      if (initialQ) setSearchQuery(initialQ);
    }
  }, []);

  React.useEffect(() => {
    const getIssueNumber = (chapter) => {
      const label = chapter?.ffLabel || chapter?.title || '';
      const match = /ff\.(\d+)/i.exec(label);
      return match ? Number(match[1]) : -1;
    };

    const seenUrls = new Set();
    const deduped = rawData.filter((ch) => {
      const u = (ch?.url || '').replace(/\/$/, '');
      if (!u || seenUrls.has(u)) return false;
      seenUrls.add(u);
      return true;
    });

    const processed = deduped
      .map(processChapter)
      .filter(Boolean)
      .sort((a, b) => getIssueNumber(b) - getIssueNumber(a));

    setProcessedData(processed);
  }, []);

  const bookSuggestions = React.useMemo(() => extractBooksFromData(processedData), [processedData]);

  const doesSubchapterMatchSelection = React.useCallback((sub, emoji) => {
    if (!emoji) return true;
    const targetTheme = mapTopicToTheme(emoji);
    if (targetTheme) {
      return mapTopicToTheme(sub.secondaryEmoji) === targetTheme;
    }
    return sub.secondaryEmoji === emoji;
  }, []);

  const filteredData = React.useMemo(() => {
    const rangeObj = ISSUE_RANGES.find((r) => r.id === selectedRange) || ISSUE_RANGES[0];

    return processedData
      .filter((chapter) => {
        if (selectedRange === 'all') return true;
        return chapter.ffNum >= rangeObj.min && chapter.ffNum <= rangeObj.max;
      })
      .map((chapter) => {
        if (!selectedEmoji) return chapter;
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
  }, [processedData, selectedEmoji, selectedRange, doesSubchapterMatchSelection]);

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
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOverlayOpen(true);
    }
  };

  const handleHideSearchOverlay = () => {
    setIsSearchOverlayOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
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
          includesQuery(chapter.ffLabel) ||
          includesQuery(chapter.subtitle) ||
          (chapter.keypoints || []).some((point) => includesQuery(point));

        const subchapters = (chapter.processedSubchapters || []).filter((sub) => {
          if (!query) return true;
          return (
            includesQuery(sub.cleanTitle) ||
            includesQuery(sub.ffLabel) ||
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

  const totalVisibleSections = React.useMemo(
    () => chaptersForIndex.reduce((acc, ch) => acc + (ch.processedSubchapters?.length || 0), 0),
    [chaptersForIndex]
  );

  const handleJumpToIssue = (e) => {
    const targetId = e.target.value;
    if (!targetId) return;
    setSelectedRange('all');
    setSelectedEmoji(null);
    setSearchQuery('');
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    e.target.value = '';
  };

  return html`<div className="min-h-screen text-black selection:bg-yellow-200 selection:text-black overflow-x-hidden">
    <${SupportPopup} />
    <${SearchResultsModal}
      chapters=${processedData}
      isOpen=${isSearchOverlayOpen}
      onHide=${handleHideSearchOverlay}
      onClear=${handleClearSearch}
      onNavigate=${handleHideSearchOverlay}
    />
    <${BooksPopup} isOpen=${isBooksOpen} onClose=${handleCloseBooks} books=${bookSuggestions} />

    <div className="py-4 sm:py-6 space-y-6 sm:space-y-8">

      <section className="brutal-card mobile-unboxed accent-bar accent-yellow no-round space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value=${searchQuery}
              onInput=${handleSearchChange}
              onKeyDown=${handleSearchKeyDown}
              placeholder=${t('searchPlaceholder')}
              className="w-full px-4 py-3 pr-20 bg-white border-3 border-black ff-input placeholder:text-gray-400 focus:outline-none focus:ring-0"
              aria-label=${t('searchLabel')}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="button"
                className="text-black text-lg lg:hidden"
                aria-label=${t('openFilterMenu')}
                onClick=${() => setIsFilterMenuOpen(true)}
              >
                🔍
              </button>
              ${searchQuery
                ? html`<button
                    type="button"
                    className="text-black text-lg"
                    aria-label=${t('clearSearch')}
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
              ${t('media')}
            </button>
            <button
              type="button"
              onClick=${handleOpenBooks}
              disabled=${bookSuggestions.length === 0}
              className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              🎲 ${t('books')}
            </button>
            <a
              href="https://www.paypal.com/paypalme/MicheleMerelli"
              target="_blank"
              rel="noopener noreferrer"
              aria-label=${t('supportLabel')}
              className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow ff-button hover:-translate-y-1 transition-transform"
            >
              ☕
            </a>
            <a
              href="https://micmer-git.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label=${t('projectsLabel')}
              className="px-4 py-3 border-3 border-black bg-[var(--ff-blue)] text-black brutal-shadow ff-button hover:-translate-y-1 transition-transform"
            >
              M
            </a>
          </div>
        </div>

        ${searchQuery.trim()
          ? html`<div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-2 border-black bg-amber-50">
              <span className="ff-caption text-black font-bold">
                ${chaptersForIndex.length} ${t('issuesUnit')} · ${totalVisibleSections} ${t('sectionsUnit')}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick=${() => setIsSearchOverlayOpen(true)}
                  className="px-3 py-1 border-2 border-black bg-[var(--ff-yellow)] ff-button text-xs"
                >
                  ${t('quickModal')}
                </button>
                <button
                  type="button"
                  onClick=${handleClearSearch}
                  className="px-3 py-1 border-2 border-black bg-white ff-button text-xs"
                >
                  ${t('clearSearch')}
                </button>
              </div>
            </div>`
          : null}

        <div className="pt-1 overflow-x-auto pb-1">
          <${Sidebar} selectedEmoji=${selectedEmoji} onSelect=${handleTopicSelect} vertical=${false} />
        </div>
      </section>

      <section id="indice" className="compact-index space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="ff-eyebrow-md text-black/80">${t('index')}</div>
              <span aria-hidden="true" className="text-black/60">·</span>
              <span className="ff-caption px-2 py-1 border-2 border-black bg-white font-bold">
                ${chaptersForIndex.length} ${t('issuesUnit')} · ${totalVisibleSections} ${t('sectionsUnit')}
              </span>
              ${selectedEmoji
                ? html`<button
                    className="ff-button border-2 border-black px-3 py-1 bg-[var(--ff-yellow)] brutal-shadow"
                    onClick=${() => handleTopicSelect(null)}
                  >
                    ✕ ${selectedEmoji}
                  </button>`
                : html`<span className="ff-eyebrow-md text-black/70">${t('allThemes')}</span>`}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label=${t('jumpToIssue')}
                onChange=${handleJumpToIssue}
                defaultValue=""
                className="px-3 py-1.5 border-2 border-black bg-white ff-button text-xs"
              >
                <option value="">${t('jumpToIssue')}</option>
                ${processedData.map((ch) => {
                  const domId = ch.issueId || ch.issueSlug || ch.url;
                  const label = `${ch.ffLabel ? ch.ffLabel + ' — ' : ''}${ch.cleanTitle}`.slice(0, 52);
                  return html`<option key=${domId} value=${domId}>${label}</option>`;
                })}
              </select>

              <button
                type="button"
                onClick=${() => setShowPreviews((v) => !v)}
                className=${`px-3 py-1.5 border-2 border-black ff-button text-xs ${showPreviews ? 'bg-[var(--ff-yellow)]' : 'bg-white'}`}
              >
                ${showPreviews ? t('hidePreviews') : t('showPreviews')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            ${ISSUE_RANGES.map((range) => {
              const active = selectedRange === range.id;
              return html`<button
                key=${range.id}
                type="button"
                onClick=${() => setSelectedRange(range.id)}
                className=${`px-3 py-1.5 border-2 border-black ff-button text-xs transition-transform ${
                  active ? 'bg-[var(--ff-yellow)] brutal-shadow' : 'bg-white hover:-translate-y-0.5'
                }`}
              >
                ${range.label || t('rangeAll')}
              </button>`;
            })}
          </div>

          <div className="space-y-6">
            ${chaptersForIndex.length > 0
              ? chaptersForIndex.map((chapter, index) =>
                  html`<${IndexChapter}
                    key=${`${chapter.url}-${index}`}
                    chapter=${chapter}
                    highlight=${debouncedSearchQuery}
                    showPreviews=${showPreviews}
                  />`
                )
              : html`<div className="border-3 border-black p-10 text-center brutal-shadow bg-white">
                  <span className="text-5xl block mb-4">🔍</span>
                  <p className="ff-body mb-4">${t('noResults')}</p>
                  <button
                    onClick=${() => {
                      handleTopicSelect(null);
                      setSelectedRange('all');
                      handleClearSearch();
                    }}
                    className="px-4 py-3 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-1 transition-transform"
                  >
                    ${t('resetFilters')}
                  </button>
                </div>`}
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick=${() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-4 py-2.5 border-3 border-black bg-white brutal-shadow ff-button hover:-translate-y-0.5 transition-transform"
            >
              ${t('backToTop')}
            </button>
          </div>
        </div>
      </section>
    </div>

    ${isMediaOpen
      ? html`<div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div role="dialog" aria-modal="true" aria-label="Media deck" className="relative max-w-5xl w-full my-auto">
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick=${handleCloseMedia}
                className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform"
              >
                ${t('closeMedia')}
              </button>
            </div>
            <${MediaSlider} chapters=${processedData} />
          </div>
        </div>`
      : null}

    ${isFilterMenuOpen
      ? html`<div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end lg:hidden" onClick=${() => setIsFilterMenuOpen(false)}>
          <div className="w-72 max-w-full bg-white border-l-4 border-black p-4 flex flex-col gap-4" onClick=${(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="ff-eyebrow text-black/80">${t('filters')}</div>
              <button
                type="button"
                aria-label=${t('closeFilters')}
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
