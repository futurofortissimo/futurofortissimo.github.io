import { React, html } from '../runtime.js';
import { slugify } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const RightSidebar = ({ chapters, isMobileMode = false, onOpenMedia }) => {
  const { searchQuery, debouncedSearchQuery, setActiveId, incrementInteraction, setIsMobileMenuOpen } = useNavigation();

  const handleItemClick = (id) => {
    setActiveId(id);
    incrementInteraction();
    if (isMobileMode) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredChapters = chapters.map((chapter) => {
    const subchapters = chapter.processedSubchapters.filter((sub) =>
      sub.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      sub.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );

    const matchesChapterTitle = chapter.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    if (debouncedSearchQuery && !matchesChapterTitle && subchapters.length === 0) return null;

    return {
      ...chapter,
      processedSubchapters: subchapters.length > 0 ? subchapters : chapter.processedSubchapters
    };
  }).filter(Boolean);

  return html`<div className="space-y-4">
    <div className="flex items-center justify-between gap-2">
      <div className="font-heading text-[11px] uppercase tracking-[0.18em] text-black">
        ${searchQuery ? `Risultati per “${searchQuery}”` : 'Naviga tra i capitoli'}
      </div>
      ${onOpenMedia
        ? html`<button
            type="button"
            onClick=${() => onOpenMedia()}
            className="px-3 py-1 border-2 border-black bg-white font-heading text-[11px] uppercase tracking-[0.18em] hover:-translate-y-0.5 transition-transform"
            aria-label="Apri media"
          >
            Media
          </button>`
        : null}
    </div>

    <div className="max-h-[70vh] overflow-y-auto pr-1 space-y-6 no-scrollbar">
      ${filteredChapters.map((chapter, cIdx) => html`<div key=${cIdx} className="space-y-2">
          <button
            className="flex items-center gap-2 text-left group"
            onClick=${() => {
              handleScrollTo(chapter.url);
              handleItemClick(chapter.url);
            }}
          >
            <span className="text-lg">${chapter.primaryEmoji || chapter.originalEmoji}</span>
            <span className="font-heading font-bold text-sm text-black group-hover:underline break-words">${chapter.cleanTitle}</span>
          </button>

          <div className="pl-4 space-y-2 border-l-4 border-black">
            ${chapter.processedSubchapters.map((sub, sIdx) => {
              const id = slugify(sub.cleanTitle);
              return html`<button
                key=${`${cIdx}-${sIdx}`}
                className="w-full text-left group"
                onClick=${() => {
                  handleScrollTo(id);
                  handleItemClick(id);
                }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base leading-none mt-0.5">${sub.originalEmoji}</span>
                  <div>
                    <div className="font-heading text-[12px] font-semibold text-black group-hover:underline break-words">${sub.cleanTitle}</div>
                  </div>
                </div>
              </button>`;
            })}
          </div>
        </div>`)}
    </div>
  </div>`;
};

export default RightSidebar;
