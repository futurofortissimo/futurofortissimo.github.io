import { html } from '../runtime.js';
import SubChapterItem from './SubChapterItem.js';

const ChapterItem = ({ chapter }) => {
  return html`<article id=${chapter.url} className="mb-10 scroll-mt-24 last:mb-0 brutal-card accent-bar accent-blue no-round">
    <div className="mb-4 border-b-4 border-black pb-3 flex items-start gap-3">
      <span className="text-2xl select-none leading-none">${chapter.primaryEmoji || chapter.originalEmoji}</span>
      <div>
        <h2 className="font-heading ff-heading-lg text-black leading-none">
          <a href=${chapter.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-4">
            ${chapter.cleanTitle}
          </a>
        </h2>
        <p className="inline-block bg-[var(--ff-yellow)] px-2 py-1 ff-eyebrow text-black mt-2">
          ${chapter.subtitle}
        </p>
      </div>
    </div>

    ${chapter.keypoints.length > 0
      ? html`<div className="mb-4">
          <ul className="space-y-2">
            ${chapter.keypoints.map(
              (point, idx) => html`<li key=${idx} className="ff-body-sm text-black font-medium flex items-start gap-2 leading-snug">
                  <span className="mt-1 w-2 h-2 bg-black shrink-0"></span>
                  <span>${point}</span>
                </li>`
            )}
          </ul>
        </div>`
      : null}

    <div className="space-y-2">
      ${chapter.processedSubchapters.map(
        (sub, idx) => html`<${SubChapterItem} key=${idx} subchapter=${sub} parentId=${chapter.url} />`
      )}
    </div>
  </article>`;
};

export default ChapterItem;
