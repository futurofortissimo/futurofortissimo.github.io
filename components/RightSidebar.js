import { React, html } from '../runtime.js';
import { slugify } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const RightSidebar = ({ chapters, isMobileMode = false }) => {
  const { searchQuery, setSearchQuery, debouncedSearchQuery, setActiveId, incrementInteraction, setIsMobileMenuOpen } = useNavigation();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

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

  return html`<div className="space-y-6">
    <div className="relative">
      <input
        type="text"
        value=${searchQuery}
        onInput=${handleSearchChange}
        placeholder="Cerca storie..."
        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">🔍</div>
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
            <span className="text-lg">${chapter.originalEmoji}</span>
            <span className="font-heading font-bold text-sm text-gray-900 group-hover:text-black transition-colors break-words">${chapter.cleanTitle}</span>
          </button>

          <div className="pl-6 space-y-2 border-l border-gray-100">
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
                    <div className="font-heading text-[13px] font-semibold text-gray-800 group-hover:text-black transition-colors break-words">${sub.cleanTitle}</div>
                    <div className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">${sub.secondaryEmoji}</div>
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
