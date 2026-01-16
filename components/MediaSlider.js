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

  const captionText = currentItem.caption?.trim();

  return html`<section className="mb-12 md:mb-16">
    <div className="relative overflow-hidden brutal-card no-round bg-white accent-bar accent-yellow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:22px_22px] opacity-10 pointer-events-none"></div>
      <div className="relative p-5 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading ff-heading-lg text-black tracking-tight">Media dall'archivio</h2>
          <div className="flex gap-2">
            <button aria-label="Previous media" onClick=${goToPrev} className="h-10 w-10 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟵</button>
            <button aria-label="Next media" onClick=${goToNext} className="h-10 w-10 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">⟶</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
          <figure className="overflow-hidden border-4 border-black bg-white brutal-shadow flex flex-col">
            <div className="relative w-full flex items-center justify-center bg-white">
              <img
                src=${currentItem.src}
                alt=${captionText || currentItem.subTitle}
                className="w-full max-h-[60vh] md:max-h-[70vh] object-contain bg-white"
                loading="lazy"
              />
            </div>
          </figure>

          <div className="flex flex-col gap-3 bg-white border-4 border-black brutal-shadow p-4 md:p-6">
            <h3 className="font-heading ff-heading-xl text-black">${currentItem.subTitle}</h3>
            <p className="ff-body-xs text-black/80">${currentItem.chapterTitle}</p>
            ${captionText
              ? html`<p className="ff-body-sm text-black leading-relaxed">${captionText}</p>`
              : null}
            <a
              href=${currentItem.link || currentItem.chapterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 border-3 border-black bg-yellow-100 ff-caption inline-flex w-fit hover:-translate-y-0.5 transition-transform"
            >
              ${currentItem.reference}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>`;
};

export default MediaSlider;
