import { React, html } from '../runtime.js';
import { t } from '../i18n.js';

const getQuote = (quote = '') => {
  if (!quote) return '';
  if (quote.length <= 280) return quote;
  return `${quote.slice(0, 277)}...`;
};

const stripFfCode = (text = '') => text.replace(/ff\.\d+(?:\.\d+)?\s*/i, '').trim();

const BooksPopup = ({ isOpen, onClose, books }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (isOpen && books.length) {
      setCurrentIndex(Math.floor(Math.random() * books.length));
    }
  }, [isOpen, books.length]);

  const goRandom = React.useCallback(() => {
    if (!books.length) return;
    setCurrentIndex((prev) => {
      if (books.length === 1) return prev;
      let next = prev;
      while (next === prev) {
        next = Math.floor(Math.random() * books.length);
      }
      return next;
    });
  }, [books.length]);

  React.useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        goRandom();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handler);
    }
    return () => window.removeEventListener('keydown', handler);
  }, [goRandom, isOpen, onClose]);

  if (!isOpen || !books.length) return null;

  const current = books[currentIndex];
  const quoteText = getQuote(current.quote || '');
  const chapterCode =
    current.subTitle?.match(/ff\.\d+(?:\.\d+)?/i)?.[0] ||
    current.chapterTitle?.match(/ff\.\d+(?:\.\d+)?/i)?.[0] ||
    t('chapter');
  const chapterLabel = [stripFfCode(current.chapterTitle), stripFfCode(current.subTitle)]
    .filter(Boolean)
    .join(' · ');

  return html`<div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto" onClick=${onClose}>
    <div
      className="bg-white border-4 border-black brutal-shadow max-w-2xl w-full overflow-y-auto max-h-[90dvh] animate-in fade-in zoom-in-95 duration-300 no-round my-auto"
      onClick=${(e) => e.stopPropagation()}
    >
      <div className="relative p-6 md:p-8 bg-white accent-bar accent-yellow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
        <div className="relative space-y-5">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <div className="ff-eyebrow text-black mb-1">${t('readingSuggestions')}</div>
              <h3 className="ff-heading-xl font-heading text-black">${current.title}</h3>
              <p className="ff-body-xs text-black/70">${chapterLabel}</p>
            </div>
            <div className="flex gap-2">
              <button aria-label=${t('prevRandom')} onClick=${goRandom} className="h-12 w-12 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟵</button>
              <button aria-label=${t('nextRandom')} onClick=${goRandom} className="h-12 w-12 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟶</button>
              <button onClick=${onClose} className="h-12 w-12 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">✕</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.9fr] gap-4 md:gap-6 items-stretch">
            ${current.image
              ? html`<figure className="border-3 border-black bg-white brutal-shadow overflow-hidden flex">
                  <img src=${current.image} alt=${current.title} className="w-full object-contain bg-white" loading="lazy" />
                </figure>`
              : null}
            <div className="border-3 border-black bg-white brutal-shadow p-4 flex flex-col gap-3">
              ${quoteText
                ? html`<p className="ff-body-sm text-black leading-relaxed">“${quoteText}”</p>`
                : html`<p className="ff-body-sm text-black leading-relaxed">${t('discoverArchive')}</p>`}

              <a
                href=${current.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border-3 border-black bg-[var(--ff-yellow)] text-black brutal-shadow ff-button w-fit hover:-translate-y-1 transition-transform"
              >
                ${t('buyAmazon')}
              </a>
              <a
                href=${current.subLink || current.chapterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 border-3 border-black bg-white text-black brutal-shadow ff-button w-fit hover:-translate-y-1 transition-transform"
              >
                ${chapterCode}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

export default BooksPopup;
