import { html } from '../runtime.js';
import SubChapterItem from './SubChapterItem.js';

const ChapterItem = ({ chapter }) => {
  return html`<article id=${chapter.url} className=${`mb-10 scroll-mt-24 last:mb-0 brutal-card accent-bar ${chapter.accentClass} no-round`}>
    <div className="mb-4 border-b-4 border-black pb-3 flex items-start gap-3">
      <span className="text-2xl select-none leading-none">${chapter.originalEmoji}</span>
      <div className="flex-1">
        <h2 className="font-heading text-xl md:text-2xl font-bold text-black leading-none">
          <a href=${chapter.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-4">
            ${chapter.cleanTitle}
          </a>
        </h2>
        <p className="text-xs md:text-sm text-black/70 font-medium mt-2">${chapter.subtitle}</p>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 border-2 border-black bg-white brutal-shadow">
        <span aria-hidden="true" className="text-xl leading-none">${chapter.categoryFlag}</span>
        <span className="mono-label text-[11px] uppercase tracking-[0.18em] text-black">${chapter.categoryLabel}</span>
      </div>
    </div>

    ${chapter.keypoints.length > 0
      ? html`<div className="mb-4">
          <ul className="space-y-2">
            ${chapter.keypoints.map(
              (point, idx) => html`<li key=${idx} className="text-xs md:text-sm text-black font-medium flex items-start gap-2 leading-snug">
                  <span className="mt-1 w-2 h-2 bg-black shrink-0"></span>
                  <span>${point}</span>
                </li>`
            )}
          </ul>
        </div>`
      : null}

    <div className="space-y-2">
      ${chapter.processedSubchapters.map(
        (sub, idx) => html`<${SubChapterItem} key=${idx} subchapter=${sub} />`
      )}
    </div>
  </article>`;
};

export default ChapterItem;
