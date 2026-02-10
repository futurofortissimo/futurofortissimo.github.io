import { React, html } from '../runtime.js';
import { slugify, HighlightText, isLinkValid } from '../utils.js';
import { useNavigation } from '../NavigationContext.js';

const isCrossReference = (text) => text.toLowerCase().includes('ff.');
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const SubChapterItem = ({ subchapter, parentId }) => {
  const { debouncedSearchQuery, incrementInteraction } = useNavigation();
  const id = slugify(subchapter.cleanTitle);

  const handleClick = () => {
    incrementInteraction();
    window.open(subchapter.link, '_blank', 'noopener,noreferrer');
  };

  return html`<div id=${id} className="relative pl-0 group scroll-mt-32 transition-all duration-300">
    <div
      className="flex items-start gap-3 cursor-pointer bg-white p-3 sm:p-3 hover:-translate-y-0.5 transition-all duration-200 active:bg-gray-50"
      onClick=${handleClick}
    >
      <span className="text-lg opacity-100 shrink-0 self-center leading-none">${subchapter.originalEmoji}</span>

      <div className="flex-1 inline leading-tight items-baseline">
        ${subchapter.ffLabel ? html`<span className="ff-label ff-label-sub mr-2">${subchapter.ffLabel}</span>` : null}
        <span className="font-heading ff-heading-md text-black mr-2 break-words hover:underline decoration-4">
          <${HighlightText} text=${subchapter.cleanTitle} highlight=${debouncedSearchQuery} />
        </span>
        ${subchapter.summary
          ? html`<p className="mt-1 ff-body-xs text-black/70 font-medium leading-snug pr-8">
              ${subchapter.summary}
            </p>`
          : null}
      </div>

      <span className="text-black shrink-0 p-1 self-center" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7" /><path d="M7 7h10v10" />
        </svg>
      </span>
    </div>
  </div>`;
};

export default SubChapterItem;
