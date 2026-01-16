import { React, html } from '../runtime.js';
import { slugify, HighlightText, isLinkValid } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const isCrossReference = (text) => text.toLowerCase().includes('ff.');
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const SubChapterItem = ({ subchapter, parentId }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { debouncedSearchQuery, activeId, incrementInteraction } = useNavigation();
  const id = slugify(subchapter.cleanTitle);

  const toggleExpand = (e) => {
    if (e) e.stopPropagation();
    incrementInteraction();
    setIsExpanded((prev) => !prev);
  };

  React.useEffect(() => {
    if (activeId === id || activeId === parentId) {
      setIsExpanded(true);
    }
  }, [activeId, id, parentId]);

  React.useEffect(() => {
    if (debouncedSearchQuery) {
      const isMatch =
        subchapter.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        subchapter.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      setIsExpanded(isMatch);
    } else {
      setIsExpanded(false);
    }
  }, [debouncedSearchQuery, subchapter]);

  const allLinks = [...subchapter.references, ...subchapter.connections];
  const validLinks = allLinks.filter((ref) => isLinkValid(ref.text, ref.url));

  return html`<div id=${id} className="relative pl-0 group scroll-mt-32 transition-all duration-300">
    <div
      className="flex items-start gap-3 cursor-pointer bg-white p-3 hover:-translate-y-1 transition-transform"
      onClick=${toggleExpand}
    >
      <span className="text-lg opacity-100 shrink-0 self-center leading-none">${subchapter.originalEmoji}</span>

      <div className="flex-1 inline leading-tight items-baseline">
        <a
          href=${subchapter.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading ff-heading-md text-black mr-2 break-words hover:underline decoration-4"
          onClick=${(e) => {
            e.stopPropagation();
            incrementInteraction();
          }}
        >
          <${HighlightText} text=${subchapter.cleanTitle} highlight=${debouncedSearchQuery} />
        </a>
        ${subchapter.summary
          ? html`<p className="mt-1 ff-body-xs text-black/70 font-medium leading-snug pr-8">
              ${subchapter.summary}
            </p>`
          : null}
      </div>

      <button
        className="text-black hover:scale-110 transition-transform shrink-0 p-1 self-center"
        aria-label="Toggle content"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className=${`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>

    <div className=${`grid transition-all duration-500 ease-in-out ${
      isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1.5 mb-3' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'
    }`}>
      <div className="overflow-hidden pl-0 md:pl-[2.5rem]">
        ${validLinks.length > 0 && isExpanded
          ? html`<div className="mb-3 flex flex-col gap-2">
              ${validLinks.map((ref, idx) => {
                const isCross = isCrossReference(ref.text);
                const displayText = isCross ? ref.text : capitalizeFirstLetter(ref.text);
                const linkClasses =
                  'inline-flex items-center gap-1 bg-[var(--ff-yellow)] ff-caption px-2 py-1 text-black w-fit hover:underline decoration-2';

                return html`<a
                  key=${idx}
                  href=${ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick=${(e) => {
                    e.stopPropagation();
                    incrementInteraction();
                  }}
                  className=${linkClasses}
                >
                  <span className="break-words">${displayText}</span>
                  ${isCross ? null : html`<span aria-hidden="true" className="text-[10px]">↗</span>`}
                </a>`;
              })}
            </div>`
          : null}
        <div className="prose prose-sm max-w-none text-black leading-relaxed font-medium break-words ff-body-xs">
          ${subchapter.content
            .split('\n')
            .map((paragraph, idx) => (paragraph.trim() ? html`<p key=${idx} className="mb-2 last:mb-0">
                  <${HighlightText} text=${paragraph} highlight=${debouncedSearchQuery} />
                </p>` : null))}
        </div>

        ${subchapter.images.length > 0
          ? html`<div className=${`grid gap-2 mt-4 ${
              subchapter.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
            }`}>
              ${subchapter.images.map(
                (img, idx) => html`<figure key=${idx} className="space-y-1">
                  <img
                    src=${img.src}
                    alt=${img.caption || 'Subchapter image'}
                    className="w-full h-auto border-3 border-black bg-white"
                    loading="lazy"
                  />
                  ${img.caption
                    ? html`<figcaption className="ff-caption text-black font-bold pl-1">
                        ${img.caption}
                      </figcaption>`
                    : null}
                </figure>`
              )}
            </div>`
          : null}
      </div>
    </div>
  </div>`;
};

export default SubChapterItem;
