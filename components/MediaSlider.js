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
              reference: extractReference(sub.title)
            });
          });
        }
      });
    });

    return items.sort(() => Math.random() - 0.5);
  }, [chapters]);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!mediaItems.length) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [mediaItems.length]);

  if (!mediaItems.length) return null;

  const currentItem = mediaItems[currentIndex];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

  return html`<section className="mb-14 md:mb-20">
    <div className="relative overflow-hidden rounded-3xl border-2 border-black shadow-[8px_8px_0px_#0f172a] bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_0)] [background-size:18px_18px] opacity-80 pointer-events-none"></div>
      <div className="relative p-6 md:p-8 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-lg bg-blue-100 text-blue-900 font-heading text-xs uppercase tracking-[0.2em] border border-blue-200">MicMer mood</div>
            <h2 className="font-heading font-black text-xl md:text-2xl tracking-tight text-gray-900 flex items-center gap-2">
              Media pop-up deck
              <span className="text-xs font-semibold text-gray-500">randomized</span>
            </h2>
          </div>
          <div className="flex gap-2">
            <button aria-label="Previous media" onClick=${goToPrev} className="h-9 w-9 rounded-xl border-2 border-black bg-yellow-200 hover:-translate-y-0.5 transition-transform shadow-[4px_4px_0px_#0f172a] active:translate-y-0">⟵</button>
            <button aria-label="Next media" onClick=${goToNext} className="h-9 w-9 rounded-xl border-2 border-black bg-yellow-200 hover:-translate-y-0.5 transition-transform shadow-[4px_4px_0px_#0f172a] active:translate-y-0">⟶</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 md:gap-8 items-center">
          <div className="overflow-hidden rounded-2xl border-2 border-black bg-gradient-to-br from-orange-50 via-white to-sky-50 shadow-[6px_6px_0px_#0f172a]">
            <div className="relative">
              <img src=${currentItem.src} alt=${currentItem.caption || currentItem.subTitle} className="w-full h-80 md:h-[22rem] object-cover" loading="lazy" />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/80 text-white text-xs font-heading uppercase tracking-[0.15em]">
                ${currentItem.reference}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white/90 rounded-2xl border-2 border-black shadow-[6px_6px_0px_#0f172a] p-4 md:p-6">
            <div className="text-xs uppercase font-heading tracking-[0.25em] text-gray-500">FF MEDIA</div>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-gray-900 leading-tight">${currentItem.subTitle}</h3>
            <p className="text-gray-600 text-sm md:text-base">${currentItem.caption || 'Appunti visivi dall’archivio, sfoglia le ispirazioni legate agli episodi ff.x.y.'}</p>
            <div className="flex flex-wrap gap-2 text-sm font-heading uppercase tracking-[0.2em]">
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-700">${currentItem.chapterTitle}</span>
              <span className="px-3 py-1 rounded-lg border border-gray-200 bg-blue-50 text-blue-700">${currentItem.reference}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
};

export default MediaSlider;
