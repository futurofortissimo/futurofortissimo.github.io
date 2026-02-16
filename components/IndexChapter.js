import { React, html } from '../runtime.js';
import { HighlightText, isLinkValid } from '../utils.js';
import { t } from '../i18n.js';

const collectSubchapterCitations = (sub) => {
  const seen = new Set();
  return [...(sub.references || []), ...(sub.connections || [])].filter((ref) => {
    if (!isLinkValid(ref?.text, ref?.url)) return false;
    const key = ref.url || ref.text;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const IndexChapter = ({ chapter, highlight }) => {

  return html`<article className="chapter-card border-b border-black/10 pb-4 sm:pb-5 last:border-b-0" id=${chapter.issueId || chapter.url}>
    <div className="flex items-start gap-2 sm:gap-3">
      <span className="text-lg sm:text-xl select-none leading-none mt-0.5">${chapter.primaryEmoji || chapter.originalEmoji}</span>
      <div className="flex-1 min-w-0">
        <h2 className="font-heading ff-heading-lg text-black chapter-title">
          ${chapter.ffLabel ? html`<span className="ff-label">${chapter.ffLabel}</span> ` : null}
          <a href=${chapter.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-4">
            <${HighlightText} text=${chapter.cleanTitle} highlight=${highlight} />
          </a>
        </h2>
        ${chapter.subtitle
          ? html`<p className="inline-block px-0 py-1 ff-eyebrow-md text-black/80 mt-1.5 sm:mt-2 sub-title">
              <${HighlightText} text=${chapter.subtitle} highlight=${highlight} />
            </p>`
          : null}
        ${chapter.keypoints.length
          ? html`<ul className="mt-3 space-y-2 ff-body text-black font-medium">
              ${chapter.keypoints.map((point, idx) =>
                html`<li key=${idx} className="leading-snug flex gap-2 items-start">
                  <span className="text-lg leading-none mt-0.5">•</span>
                  <span><${HighlightText} text=${point} highlight=${highlight} /></span>
                </li>`
              )}
            </ul>`
          : null}
      </div>
    </div>

    <div className="mt-3 sm:mt-5 space-y-2 sm:space-y-3">
      ${chapter.processedSubchapters.map((sub, idx) => {
        const citations = collectSubchapterCitations(sub);
        return html`<div key=${idx} className="flex gap-2 items-start">
          <span className="text-lg sm:text-xl leading-none mt-0.5">${sub.originalEmoji}</span>
          <div className="flex-1 min-w-0">
            ${sub.ffLabel ? html`<span className="ff-label ff-label-sub">${sub.ffLabel}</span> ` : null}
            <a
              href=${sub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading ff-heading-md text-black hover:underline decoration-2 break-words"
            >
              <${HighlightText} text=${sub.cleanTitle} highlight=${highlight} />
            </a>

            ${citations.length
              ? html`<details className="mt-2">
                  <summary className="links-toggle inline-flex items-center gap-2 border-3 border-black bg-white brutal-shadow ff-button px-3 py-2 cursor-pointer">
                    ${t('showCitations')} (${citations.length})
                  </summary>
                  <div className="flex flex-wrap gap-2 mt-3">
                    ${citations.map((ref, refIdx) =>
                      html`<a
                        key=${refIdx}
                        href=${ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-[var(--ff-yellow)] ff-caption px-2 py-1 text-black hover:underline decoration-2 brutal-shadow"
                      >
                        <${HighlightText} text=${ref.text} highlight=${highlight} />
                      </a>`
                    )}
                  </div>
                </details>`
              : null}
          </div>
        </div>`;
      })}
    </div>
  </article>`;
};

export default IndexChapter;
