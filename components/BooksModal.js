import { React, html } from '../runtime.js';
import { TopicEmoji } from '../types.js';
import booksData from '../books.json';

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

const extractReferenceLabel = (title = '') => {
  const match = title.match(/ff\.?\s*\d+(?:\.\d+)?/i);
  return match ? match[0].replace(/\s+/g, '') : 'ff';
};

const BooksModal = ({ sections, onClose }) => {
  const hasSections = Array.isArray(sections) && sections.length > 0;
  const [selectedFilter, setSelectedFilter] = React.useState(null);

  const filters = React.useMemo(() => {
    const available = new Set();
    sections.forEach((section) => {
      if (section.secondaryEmoji) {
        available.add(section.secondaryEmoji);
      }
    });

    const uniqueFilters = Array.from(available);
    return [TopicEmoji.BOOKS, ...uniqueFilters.filter((emoji) => emoji !== TopicEmoji.BOOKS)];
  }, [sections]);

  const filteredSections = React.useMemo(() => {
    if (!selectedFilter || selectedFilter === TopicEmoji.BOOKS) return sections;
    return sections.filter((section) => section.secondaryEmoji === selectedFilter);
  }, [sections, selectedFilter]);

  return html`<div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm overflow-y-auto p-4 sm:p-6">
    <div className="max-w-5xl mx-auto bg-white border-4 border-black brutal-shadow no-round">
      <div className="p-5 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-[11px] font-heading uppercase tracking-[0.3em] text-black">Biblioteca</div>
            <h3 className="text-2xl font-heading font-black leading-tight">Tutte le sezioni libro</h3>
            <p className="text-sm text-black/70 max-w-2xl">Scorri le citazioni dei libri presenti nei capitoli e apri subito la fonte su Amazon.</p>
          </div>
          <button
            onClick=${onClose}
            className="px-3 py-2 border-3 border-black bg-white font-heading text-[11px] uppercase tracking-[0.2em] brutal-shadow hover:-translate-y-0.5 transition-transform"
          >
            Chiudi
          </button>
        </div>

        ${hasSections
          ? html`<div className="flex flex-wrap gap-2 items-center">
              <span className="text-[11px] font-heading uppercase tracking-[0.3em] text-black">Filtri</span>
              <div className="flex flex-wrap gap-2">
                <button
                  className=${`px-3 py-1 border-2 border-black font-heading text-[11px] uppercase tracking-[0.2em] transition-transform brutal-shadow ${
                    selectedFilter === null ? 'bg-[var(--ff-blue)]' : 'bg-white'
                  }`}
                  onClick=${() => setSelectedFilter(null)}
                >
                  Tutti
                </button>
                ${filters.map(
                  (emoji) => html`<button
                    key=${emoji}
                    className=${`px-3 py-1 border-2 border-black font-heading text-[11px] uppercase tracking-[0.2em] transition-transform brutal-shadow flex items-center gap-2 ${
                      selectedFilter === emoji ? 'bg-[var(--ff-yellow)]' : 'bg-white'
                    }`}
                    onClick=${() => setSelectedFilter(emoji)}
                  >
                    <span aria-hidden="true">${emoji}</span>
                    <span className="text-[10px] font-semibold">
                      ${emoji === TopicEmoji.BOOKS ? 'Sezioni libro' : 'Filtro'}
                    </span>
                  </button>`
                )}
              </div>
            </div>`
          : null}

        ${!hasSections
          ? html`<div className="border-3 border-black p-6 text-center brutal-shadow bg-white">
              <p className="font-heading text-base">Nessuna sezione libro trovata.</p>
            </div>`
          : html`<div className="grid gap-4 sm:grid-cols-2">
              ${filteredSections.map((section, idx) => {
                const previewImage = getPreviewImage(section.images);
                const amazonRef = getAmazonReference(section.references);
                const bookMetadata = amazonRef ? booksMap.get(normalizeUrl(amazonRef.url)) : null;
                const bookTitle = bookMetadata?.title || amazonRef?.text || section.subchapterTitle;
                const bookAuthor = bookMetadata?.author || section.chapterTitle;
                const referenceLabel = extractReferenceLabel(section.subchapterTitle);
                const quote = section.quote || '';

                return html`<article key=${idx} className="border-3 border-black bg-white brutal-shadow p-4 flex flex-col gap-3 h-full">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-heading font-bold text-base leading-tight">${bookTitle}</div>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-black/70">${bookAuthor}</div>
                    </div>
                    <span className="text-xl" aria-hidden="true">📚</span>
                  </div>

                  ${previewImage
                    ? html`<figure className="space-y-1">
                        <img src=${previewImage.src} alt=${previewImage.caption || 'Anteprima libro'} className="w-full h-auto border-3 border-black bg-white" loading="lazy" />
                        ${previewImage.caption
                          ? html`<figcaption className="text-[10px] font-heading uppercase tracking-widest text-black font-bold pl-1">${previewImage.caption}</figcaption>`
                          : null}
                      </figure>`
                    : html`<blockquote className="border-l-4 border-black pl-3 text-sm leading-snug text-black/80">
                        “${quote.length > 220 ? `${quote.slice(0, 220)}…` : quote}”
                      </blockquote>`}

                  <div className="flex flex-wrap gap-2 mt-auto">
                    ${amazonRef
                      ? html`<a
                          href=${amazonRef.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 border-2 border-black bg-[var(--ff-yellow)] font-heading text-[11px] uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                        >
                          Leggi su Amazon ↗
                        </a>`
                      : null}
                    <a
                      href=${section.subchapterLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 border-2 border-black bg-white font-heading text-[11px] uppercase tracking-[0.2em] hover:-translate-y-0.5 transition-transform"
                    >
                      Apri ${referenceLabel}
                    </a>
                  </div>
                </article>`;
              })}
            </div>`}
      </div>
    </div>
  </div>`;
};

export default BooksModal;
