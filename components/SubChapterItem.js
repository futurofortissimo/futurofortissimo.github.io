import { React, html } from '../runtime.js';
import { slugify, HighlightText } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const isValidLink = (text, url) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  const lowerUrl = url.toLowerCase();

  if (lowerText.includes('whatsapp')) return false;
  if (lowerText.includes('offrimi')) return false;
  if (lowerText.includes('caffè') || lowerText.includes('caffe')) return false;
  if (lowerText.includes('micmer')) return false;
  if (lowerText.includes('iscriviti')) return false;
  if (lowerText.includes('supportare questo progetto')) return false;
  if (lowerText.trim() === '☕') return false;
  if (lowerText.trim() === '❤️') return false;
  if (lowerText.trim() === '.') return false;

  if (lowerUrl.includes('paypal')) return false;
  if (lowerUrl.includes('whatsapp')) return false;

  return true;
};

const isCrossReference = (text) => text.toLowerCase().includes('ff.');
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const SubChapterItem = ({ subchapter }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { debouncedSearchQuery, activeId, incrementInteraction } = useNavigation();
  const id = slugify(subchapter.cleanTitle);

  const toggleExpand = (e) => {
    if (e) e.stopPropagation();
    incrementInteraction();
    setIsExpanded((prev) => !prev);
  };

  React.useEffect(() => {
    if (activeId === id) {
      setIsExpanded(true);
    }
  }, [activeId, id]);

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
  const validLinks = allLinks.filter((ref) => isValidLink(ref.text, ref.url));

  return html`<div id=${id} className="relative pl-0 group mb-6 scroll-mt-32 transition-all duration-300">
    <div
      className="flex items-baseline gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-1 -ml-1 transition-colors select-none active:scale-[0.99] transform duration-100"
      onClick=${toggleExpand}
    >
      <span className="text-xl opacity-100 shrink-0 self-center leading-none">${subchapter.originalEmoji}</span>

      <div className="flex-1 inline leading-tight items-baseline">
        <a
          href=${subchapter.link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors mr-2 break-words hover:underline decoration-2 underline-offset-2"
          onClick=${(e) => {
            e.stopPropagation();
            incrementInteraction();
          }}
        >
          <${HighlightText} text=${subchapter.cleanTitle} highlight=${debouncedSearchQuery} />
        </a>

        <span
          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-xs hover:bg-gray-200 hover:scale-110 transition-all cursor-default align-middle relative -top-0.5"
          title=${`Topic: ${subchapter.secondaryEmoji}`}
          onClick=${(e) => {
            e.stopPropagation();
            incrementInteraction();
          }}
        >
          ${subchapter.secondaryEmoji}
        </span>
      </div>

      <button
        className="text-gray-400 hover:text-black transition-colors shrink-0 p-1 self-center active:bg-gray-100 rounded-full"
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

    ${validLinks.length > 0
      ? html`<div className="pl-0 md:pl-[2.5rem] mt-1 mb-3">
          <div className="flex flex-wrap gap-2">
            ${validLinks.map((ref, idx) => {
              const isCross = isCrossReference(ref.text);
              const displayText = isCross ? ref.text : capitalizeFirstLetter(ref.text);

              return html`<a
                key=${idx}
                href=${ref.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick=${(e) => {
                  e.stopPropagation();
                  incrementInteraction();
                }}
                className=${`inline-flex items-center gap-1.5 px-3 py-0.5 border rounded-full transition-all duration-200 ${
                  isCross
                    ? 'bg-blue-50 hover:bg-blue-100 border-blue-100 text-blue-700'
                    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-sm font-bold font-heading break-all hover:underline decoration-2 underline-offset-2">
                  ${displayText}
                </span>
                ${!isCross ? html`<span className="text-gray-400 text-xs transition-colors">↗</span>` : null}
              </a>`;
            })}
          </div>
        </div>`
      : null}

    <div className=${`grid transition-all duration-500 ease-in-out ${
      isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2 mb-4' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'
    }`}>
      <div className="overflow-hidden pl-0 md:pl-[2.5rem]">
        <div className="prose prose-sm max-w-none text-gray-800 leading-normal font-normal break-words">
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
                    className="w-full h-auto rounded-lg border border-gray-100 shadow-sm bg-gray-50"
                    loading="lazy"
                  />
                  ${img.caption
                    ? html`<figcaption className="text-[9px] font-heading uppercase tracking-widest text-gray-500 font-bold pl-1">
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
