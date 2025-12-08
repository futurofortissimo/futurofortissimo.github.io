import { React, html } from '../runtime.js';
import { HighlightText, slugify } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const createSnippet = (content, query) => {
  if (!content) return '';
  const normalizedContent = content.replace(/\n+/g, ' ');
  const lowerContent = normalizedContent.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return normalizedContent.slice(0, 160);
  }

  const start = Math.max(0, index - 60);
  const end = Math.min(normalizedContent.length, index + lowerQuery.length + 90);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < normalizedContent.length ? '…' : '';

  return `${prefix}${normalizedContent.slice(start, end)}${suffix}`;
};

const buildSearchResults = (chapters, query) => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();

  return chapters
    .map((chapter) => {
      const results = [];
      const chapterMatches =
        chapter.cleanTitle.toLowerCase().includes(lowerQuery) ||
        (chapter.subtitle && chapter.subtitle.toLowerCase().includes(lowerQuery)) ||
        (chapter.keypoints || []).some((point) => point.toLowerCase().includes(lowerQuery));

      if (chapterMatches) {
        results.push({
          type: 'chapter',
          id: chapter.url,
          emoji: chapter.primaryEmoji || chapter.originalEmoji,
          title: chapter.cleanTitle,
          subtitle: chapter.subtitle
        });
      }

      chapter.processedSubchapters.forEach((sub) => {
        if (
          sub.cleanTitle.toLowerCase().includes(lowerQuery) ||
          sub.content.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            type: 'subchapter',
            id: slugify(sub.cleanTitle),
            emoji: sub.originalEmoji,
            title: sub.cleanTitle,
            chapterTitle: chapter.cleanTitle,
            snippet: createSnippet(sub.content, query)
          });
        }
      });

      return results;
    })
    .flat();
};

const SearchResultsModal = ({ chapters, isOpen, onHide, onClear, onNavigate }) => {
  const { debouncedSearchQuery, searchQuery, setActiveId } = useNavigation();

  if (!isOpen || !debouncedSearchQuery.trim()) return null;

  const results = buildSearchResults(chapters, debouncedSearchQuery);

  const handleNavigate = (id) => {
    setActiveId(id);
    if (typeof onNavigate === 'function') {
      onNavigate();
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return html`<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
    <div className="max-w-4xl mx-auto bg-white border-4 border-black brutal-shadow no-round"> 
      <div className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-[11px] font-heading uppercase tracking-[0.3em] text-black">Ricerca</div>
            <h3 className="text-2xl font-heading font-black leading-tight">Risultati per “${searchQuery}”</h3>
            <p className="text-sm text-black/70 max-w-2xl">Apri il risultato per scorrere alla card corrispondente. I testi coincidono con l’evidenziazione già visibile nelle schede.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick=${onHide}
              className="px-3 py-2 border-3 border-black bg-white font-heading text-[11px] uppercase tracking-[0.2em] brutal-shadow hover:-translate-y-0.5 transition-transform"
            >
              Nascondi
            </button>
            <button
              onClick=${onClear}
              className="px-3 py-2 border-3 border-black bg-[var(--ff-yellow)] font-heading text-[11px] uppercase tracking-[0.2em] brutal-shadow hover:-translate-y-0.5 transition-transform"
            >
              Azzera ricerca
            </button>
          </div>
        </div>

        ${results.length === 0
          ? html`<div className="border-3 border-black p-6 text-center brutal-shadow bg-white">
              <p className="font-heading text-base">Nessun contenuto corrisponde alla ricerca.</p>
            </div>`
          : html`<ol className="space-y-3">
              ${results.map(
                (item, idx) => html`<li key=${idx}>
                  <button
                    className="w-full text-left border-3 border-black bg-white brutal-shadow p-4 sm:p-5 hover:-translate-y-1 transition-transform"
                    onClick=${() => handleNavigate(item.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg leading-none">${item.emoji}</span>
                        <div>
                          <div className="font-heading font-bold text-base sm:text-lg text-black">
                            <${HighlightText} text=${item.title} highlight=${debouncedSearchQuery} />
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.2em] text-black/70">${item.type === 'chapter'
                            ? 'Capitolo'
                            : `Sottocapitolo · ${item.chapterTitle}`}</div>
                        </div>
                      </div>
                      <span className="text-xs font-heading px-2 py-1 border-2 border-black bg-white">Apri</span>
                    </div>
                    ${item.snippet
                      ? html`<p className="mt-3 text-sm text-black/80 leading-snug">
                          <${HighlightText} text=${item.snippet} highlight=${debouncedSearchQuery} />
                        </p>`
                      : null}
                  </button>
                </li>`
              )}
            </ol>`}
      </div>
    </div>
  </div>`;
};

export default SearchResultsModal;
