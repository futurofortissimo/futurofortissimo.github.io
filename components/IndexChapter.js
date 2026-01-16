import { React, html } from '../runtime.js';
import { HighlightText, isLinkValid } from '../utils.js';

const collectCitations = (subchapters = []) => {
  const seen = new Set();

  return subchapters.reduce((acc, sub) => {
    [...(sub.references || []), ...(sub.connections || [])].forEach((ref) => {
      if (!isLinkValid(ref.text, ref.url)) return;
      const key = ref.url || ref.text;
      if (seen.has(key)) return;
      seen.add(key);
      acc.push(ref);
    });
    return acc;
  }, []);
};

const IndexChapter = ({ chapter, highlight }) => {
  const citations = collectCitations(chapter.processedSubchapters);
  const [showCitations, setShowCitations] = React.useState(false);

  return html`<article className="chapter-card border-b border-black/10 pb-5 last:border-b-0" id=${chapter.url}>
    <div className="flex items-start gap-3">
      <span className="text-xl select-none leading-none">${chapter.primaryEmoji || chapter.originalEmoji}</span>
      <div className="flex-1">
        <h2 className="font-heading ff-heading-lg text-black chapter-title">
          <a href=${chapter.url} target="_blank" rel="noopener noreferrer" className="hover:underline decoration-4">
            <${HighlightText} text=${chapter.cleanTitle} highlight=${highlight} />
          </a>
        </h2>
        ${chapter.subtitle
          ? html`<p className="inline-block px-0 py-1 ff-eyebrow-md text-black/80 mt-2 sub-title">
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

    <div className="mt-5 space-y-3">
      ${chapter.processedSubchapters.map((sub, idx) =>
        html`<div key=${idx} className="flex gap-2 items-start">
          <span className="text-xl leading-none mt-0.5">${sub.originalEmoji}</span>
          <div className="flex-1">
            <a
              href=${sub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading ff-heading-md text-black hover:underline decoration-2 break-words"
            >
              <${HighlightText} text=${sub.cleanTitle} highlight=${highlight} />
            </a>
            ${sub.summary
              ? html`<p className="ff-body-sm text-black/70 leading-snug mt-1">
                  <${HighlightText} text=${sub.summary} highlight=${highlight} />
                </p>`
              : null}
          </div>
        </div>`
      )}
    </div>

    ${citations.length
      ? html`<div className="mt-5 border-t border-black/10 pt-3">
          <button
            type="button"
            className="links-toggle inline-flex items-center gap-2 border-3 border-black bg-white brutal-shadow ff-button px-3 py-2"
            onClick=${() => setShowCitations((prev) => !prev)}
            aria-expanded=${showCitations}
          >
            ${showCitations ? 'Nascondi link' : `Link citati (${citations.length})`}
            <span aria-hidden="true">${showCitations ? '▲' : '▼'}</span>
          </button>
          ${showCitations
            ? html`<div className="flex flex-wrap gap-2 mt-3">
                ${citations.map((ref, idx) =>
                  html`<a
                    key=${idx}
                    href=${ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[var(--ff-yellow)] ff-caption px-2 py-1 text-black hover:underline decoration-2 brutal-shadow"
                  >
                    <${HighlightText} text=${ref.text} highlight=${highlight} />
                  </a>`
                )}
              </div>`
            : null}
        </div>`
      : null}
  </article>`;
};

export default IndexChapter;
