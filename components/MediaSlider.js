import { React, html } from '../runtime.js';

const extractReference = (title = '') => {
  const match = title.match(/ff\.?\d+(\.\d+)?/i);
  return match ? match[0].replace(/\s+/g, '') : 'ff';
};

const MediaSlider = ({ chapters }) => {
  const mediaItems = React.useMemo(() => {
    const items = [];

    chapters.forEach((chapter) => {
      chapter.processedSubchapters.forEach((sub) => {
        if (Array.isArray(sub.images)) {
          sub.images.forEach((image, index) => {
            items.push({
              ...image,
              id: `${sub.link}-${index}`,
              chapterTitle: chapter.cleanTitle,
              subTitle: sub.cleanTitle,
              reference: extractReference(sub.title),
              link: sub.link,
              chapterUrl: chapter.url
            });
          });
        }
      });
    });

    return items;
  }, [chapters]);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!mediaItems.length) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  if (!mediaItems.length) return null;

  const currentItem = mediaItems[currentIndex];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  const overlayLabel = currentItem.caption?.trim() ? currentItem.caption : currentItem.reference;

  return html`<section className="mb-12 md:mb-16">
    <div className="relative overflow-hidden brutal-card no-round bg-white accent-bar accent-yellow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:22px_22px] opacity-10 pointer-events-none"></div>
      <div className="relative p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading font-black text-xl md:text-2xl tracking-tight text-black">Media dall'archivio</h2>
          <div className="flex gap-2">
            <button aria-label="Previous media" onClick=${goToPrev} className="h-10 w-10 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟵</button>
            <button aria-label="Next media" onClick=${goToNext} className="h-10 w-10 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟶</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
          <div className="overflow-hidden border-4 border-black bg-white brutal-shadow flex items-center justify-center">
            <div className="relative w-full">
              <img
                src=${currentItem.src}
                alt=${currentItem.caption || currentItem.subTitle}
                className="w-full max-h-[70vh] object-contain bg-white"
                loading="lazy"
              />
              ${overlayLabel
                ? html`<div className="absolute bottom-3 left-3 right-3 px-3 py-2 border-3 border-black bg-white text-black text-xs font-heading uppercase tracking-[0.12em] brutal-shadow">${overlayLabel}</div>`
                : null}
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white border-4 border-black brutal-shadow p-4 md:p-6">
            <h3 className="font-heading text-2xl md:text-3xl font-black text-black leading-tight">${currentItem.subTitle}</h3>
            <p className="text-sm md:text-base text-black/80">${currentItem.chapterTitle}</p>
            ${currentItem.reference
              ? html`<span className="px-3 py-1 border-3 border-black bg-yellow-100 text-xs font-heading uppercase tracking-[0.18em] inline-flex w-fit">${currentItem.reference}</span>`
              : null}
            <div className="flex flex-wrap gap-2 text-sm font-heading uppercase tracking-[0.2em]">
              <a
                href=${currentItem.link || currentItem.chapterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border-3 border-black bg-[var(--ff-blue)] text-black hover:-translate-y-0.5 transition-transform"
              >
                Apri sezione
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
};

export default MediaSlider;
