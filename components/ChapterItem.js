import { html } from '../runtime.js';
import SubChapterItem from './SubChapterItem.js';

const ChapterItem = ({ chapter }) => {
  return html`<article id=${chapter.url} className="mb-10 scroll-mt-24 last:mb-0">
    <div className="mb-4">
      <div className="flex items-baseline gap-2 mb-1 p-1 -ml-1">
        <span className="text-xl select-none grayscale opacity-90 leading-none self-center">${chapter.originalEmoji}</span>
        <h2 className="font-heading text-xl font-bold text-gray-900 tracking-tight leading-tight">
          <a href=${chapter.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
            ${chapter.cleanTitle}
          </a>
        </h2>
      </div>

      <div className="pl-0 md:pl-[2.5rem]">
        <p className="text-sm text-gray-500 font-normal leading-relaxed mb-3">${chapter.subtitle}</p>

        ${chapter.keypoints.length > 0
          ? html`<div className="mb-4">
              <ul className="space-y-1">
                ${chapter.keypoints.map(
                  (point, idx) => html`<li key=${idx} className="text-sm text-gray-800 font-normal flex items-start gap-2 leading-snug font-heading">
                    <span className="mt-1.5 w-1 h-1 bg-gray-900 rounded-full shrink-0 opacity-60"></span>
                    <span>${point}</span>
                  </li>`
                )}
              </ul>
            </div>`
          : null}
      </div>
    </div>

    <div className="space-y-2">
      ${chapter.processedSubchapters.map(
        (sub, idx) => html`<${SubChapterItem} key=${idx} subchapter=${sub} />`
      )}
    </div>
  </article>`;
};

export default ChapterItem;
