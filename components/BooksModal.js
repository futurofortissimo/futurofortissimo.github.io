import { React, html } from '../runtime.js';
import { TopicEmoji } from '../types.js';
import booksData from '../books.json' assert { type: 'json' };
import { t } from '../i18n.js';

const normalizeUrl = (url = '') => url.replace(/\/$/, '');

const booksMap = booksData.reduce((acc, book) => {
  if (book.url) {
    acc.set(normalizeUrl(book.url), { title: book.book, author: book.author });
  }
  return acc;
}, new Map());

const getAmazonReference = (references = []) =>
  references.find((ref) => /amzn\.\w+|amazon\./i.test(ref.url));

const getPreviewImage = (images = []) => images.find((img) => img.src);

const extractReferenceLabel = (chapterTitle = '', subchapterTitle = '') => {
  const combinedTitle = `${subchapterTitle} ${chapterTitle}`;
  const match = combinedTitle.match(/ff\.?\s*([0-9]+(?:bis)?(?:\.[0-9]+)?)/i);
  return match ? `ff.${match[1].replace(/\s+/g, '')}` : 'ff';
};

const BooksModal = ({ sections, onClose }) => {
  const safeSections = Array.isArray(sections) ? sections : [];
  const hasSections = safeSections.length > 0;
  const [selectedFilter, setSelectedFilter] = React.useState(null);
  const [selectedBookTitle, setSelectedBookTitle] = React.useState('all');

  const enhancedSections = React.useMemo(
    () =>
      safeSections.map((section) => {
        const previewImage = getPreviewImage(section.images);
        const amazonRef = getAmazonReference(section.references);
        const bookMetadata = amazonRef ? booksMap.get(normalizeUrl(amazonRef.url)) : null;
        const bookTitle = bookMetadata?.title || amazonRef?.text || section.subchapterTitle;
        const cleanedChapterTitle = section.chapterTitle.replace(/ff\.?\s*\d+[a-zA-Z]*(?:\.\d+)?\s*/i, '').trim();
        const bookAuthor = bookMetadata?.author || cleanedChapterTitle || section.chapterTitle;
        const referenceLabel = extractReferenceLabel(section.chapterTitle, section.subchapterTitle);
        const quote = section.quote || '';

        return {
          ...section,
          previewImage,
          amazonRef,
          bookMetadata,
          bookTitle,
          bookAuthor,
          referenceLabel,
          quote
        };
      }),
    [safeSections]
  );

  const filters = React.useMemo(() => {
    const available = new Set();
    enhancedSections.forEach((section) => {
      if (section.secondaryEmoji) {
        available.add(section.secondaryEmoji);
      }
    });

    const uniqueFilters = Array.from(available);
    return [TopicEmoji.BOOKS, ...uniqueFilters.filter((emoji) => emoji !== TopicEmoji.BOOKS)];
  }, [enhancedSections]);

  const bookFilters = React.useMemo(() => {
    const books = new Map();

    enhancedSections.forEach((section) => {
      if (section.amazonRef && section.bookTitle) {
        const key = section.bookTitle;
        books.set(key, { title: section.bookTitle, author: section.bookAuthor });
      }
    });

    return Array.from(books.values());
  }, [enhancedSections]);

  const filteredSections = React.useMemo(() => {
    let results = enhancedSections;

    if (selectedFilter && selectedFilter !== TopicEmoji.BOOKS) {
      results = results.filter((section) => section.secondaryEmoji === selectedFilter);
    }

    if (selectedBookTitle !== 'all') {
      results = results.filter((section) => section.bookTitle === selectedBookTitle);
    }

    return results;
  }, [enhancedSections, selectedFilter, selectedBookTitle]);

  return html`<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
    <div className="max-w-5xl w-full mx-auto bg-white border-4 border-black brutal-shadow no-round max-h-[calc(100vh-2rem)] overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-col gap-5 overflow-y-auto max-h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="ff-eyebrow text-black">${t('library')}</div>
            <h3 className="ff-heading-xl font-heading text-black">${t('allBookSections')}</h3>
            <p className="ff-body-sm text-black/70 max-w-2xl">${t('bookSectionsHint')}</p>
          </div>
          <button
            onClick=${onClose}
            className="px-3 py-2 border-3 border-black bg-white ff-button brutal-shadow hover:-translate-y-0.5 transition-transform"
          >
            ${t('close')}
          </button>
        </div>

        ${hasSections
          ? html`<div className="space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="ff-eyebrow text-black">${t('filterByEmoji')}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className=${`px-3 py-1 border-2 border-black ff-caption transition-transform brutal-shadow ${
                      selectedFilter === null ? 'bg-[var(--ff-blue)]' : 'bg-white'
                    }`}
                    onClick=${() => setSelectedFilter(null)}
                  >
                    ${t('all')}
                  </button>
                  ${filters.map(
                    (emoji) => html`<button
                      key=${emoji}
                      className=${`px-3 py-1 border-2 border-black ff-caption transition-transform brutal-shadow flex items-center gap-2 ${
                        selectedFilter === emoji ? 'bg-[var(--ff-yellow)]' : 'bg-white'
                      }`}
                      onClick=${() => setSelectedFilter(emoji)}
                    >
                      <span aria-hidden="true">${emoji}</span>
                      <span className="text-[10px] font-semibold">
                        ${emoji === TopicEmoji.BOOKS ? t('bookSections') : t('filter')}
                      </span>
                    </button>`
                  )}
                </div>
              </div>

              ${bookFilters.length
                ? html`<div className="flex flex-col gap-2">
                    <span className="ff-eyebrow text-black">${t('filterByBook')}</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className=${`px-3 py-1 border-2 border-black ff-caption transition-transform brutal-shadow ${
                          selectedBookTitle === 'all' ? 'bg-[var(--ff-blue)]' : 'bg-white'
                        }`}
                        onClick=${() => setSelectedBookTitle('all')}
                      >
                        ${t('allBooks')}
                      </button>
                      ${bookFilters.map(
                        ({ title, author }) => html`<button
                          key=${title}
                          className=${`px-3 py-1 border-2 border-black ff-caption transition-transform brutal-shadow flex items-center gap-2 text-left ${
                            selectedBookTitle === title ? 'bg-[var(--ff-yellow)]' : 'bg-white'
                          }`}
                          onClick=${() => setSelectedBookTitle(title)}
                          title=${author ? `${title} — ${author}` : title}
                        >
                          <span aria-hidden="true">📚</span>
                          <span className="text-[10px] font-semibold">${title}${author ? ` — ${author}` : ''}</span>
                        </button>`
                      )}
                    </div>
                  </div>`
                : null}
            </div>`
          : null}

        ${!hasSections
          ? html`<div className="border-3 border-black p-6 text-center brutal-shadow bg-white">
              <p className="font-heading ff-body">${t('noBookSections')}</p>
            </div>`
          : html`<div className="grid gap-4 sm:grid-cols-2">
              ${filteredSections.map((section, idx) =>
                html`<article key=${idx} className="border-3 border-black bg-white brutal-shadow p-4 flex flex-col gap-3 h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="font-heading ff-heading-md text-black">${section.bookTitle}</div>
                      <div className="ff-eyebrow text-black/70">${section.bookAuthor}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xl" aria-hidden="true">📚</span>
                      <span className="px-2 py-1 border-2 border-black ff-caption bg-[var(--ff-yellow)]">${section.referenceLabel}</span>
                    </div>
                  </div>

                  ${section.previewImage
                    ? html`<figure className="space-y-1">
                        <img src=${section.previewImage.src} alt=${section.previewImage.caption || t('bookPreview')} className="w-full h-auto border-3 border-black bg-white" loading="lazy" />
                        ${section.previewImage.caption
                          ? html`<figcaption className="ff-caption text-black font-bold pl-1">${section.previewImage.caption}</figcaption>`
                          : null}
                      </figure>`
                    : html`<blockquote className="border-l-4 border-black pl-3 ff-body-sm leading-snug text-black/80">
                        “${section.quote.length > 220 ? `${section.quote.slice(0, 220)}…` : section.quote}”
                      </blockquote>`}

                  <div className="flex flex-wrap gap-2 mt-auto">
                    ${section.amazonRef
                      ? html`<a
                          href=${section.amazonRef.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 border-2 border-black bg-[var(--ff-yellow)] ff-button hover:-translate-y-0.5 transition-transform"
                        >
                          ${t('readAmazon')}
                        </a>`
                      : null}
                    <a
                      href=${section.subchapterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border-2 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform"
                    >
                      ${t('open')} ${section.referenceLabel}
                    </a>
                  </div>
                </article>`
              )}
            </div>`}
      </div>
    </div>
  </div>`;
};

export default BooksModal;
