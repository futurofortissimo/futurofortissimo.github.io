import { React, html } from '../runtime.js';

const themeColors = {
  1: { accent: 'var(--ff-blue)', bg: 'bg-blue-50' },
  2: { accent: 'var(--ff-green)', bg: 'bg-green-50' },
  3: { accent: 'var(--ff-red)', bg: 'bg-red-50' }
};

const BookOutlinePopup = ({ onClose }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(`./generated/book/outline.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));
  }, []);

  const pad2 = (n) => String(n).padStart(2, '0');

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label="Outline libro" className="relative max-w-5xl w-full">
      <div className="absolute right-4 top-4 z-10">
        <button onClick=${onClose} className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform">
          Chiudi
        </button>
      </div>

      <div className="border-3 border-black bg-white brutal-shadow p-6 max-h-[80vh] overflow-auto">
        <div className="ff-eyebrow-md text-black/80">Libro / mini-saggi</div>
        <h2 className="ff-heading-xl mt-2">Tre Macro Temi</h2>
        <p className="ff-body text-black/70 mt-2">Tre saggi interconnessi: 💻 Tecnologia, 🍃 Natura e 👥 Società. Un percorso quantitativo attraverso 147 numeri e 563 note del corpus.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            data-nav="1"
            data-track="book_static_open"
            href="./book/"
            className="px-4 py-2 border-3 border-black bg-[var(--ff-yellow)] brutal-shadow ff-button hover:-translate-y-0.5 transition-transform"
          >
            Apri pagine (SEO)
          </a>
        </div>

        ${!data
          ? html`<p className="mt-6">Caricamento…</p>`
          : data.error
            ? html`<p className="mt-6">Errore caricamento outline.</p>`
            : html`<div className="mt-6 space-y-6">
                ${(data.chapters || []).map((c) => {
                  const colors = themeColors[c.n] || themeColors[1];
                  const totalRefs = (c.subchapters || []).reduce((sum, s) => sum + (s.refs || []).length, 0);
                  return html`
                    <div key=${c.n} className="border-3 border-black p-5 brutal-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">${c.emoji}</span>
                        <div>
                          <div className="ff-caption" style=${{ color: colors.accent }}>Capitolo ${c.n} / 3</div>
                          <div className="text-lg font-bold mt-1">${c.title}</div>
                        </div>
                      </div>
                      <div className="ff-body text-black/80 mb-4">${c.thesis}</div>

                      <div className="space-y-3">
                        ${(c.subchapters || []).map((sub, idx) => html`
                          <div key=${idx} className="border-2 border-black/20 p-3 ${colors.bg}">
                            <div className="ff-eyebrow text-black/60">${c.n}.${idx + 1}</div>
                            <div className="font-bold text-sm mt-1 uppercase">${sub.title}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              ${(sub.refs || []).map((r) => html`<span key=${r} className="px-2 py-0.5 border-2 border-black/30 text-xs ff-button bg-white">${r}</span>`)}
                            </div>
                          </div>
                        `)}
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <a
                          className="ff-button underline"
                          data-track="chapter_open"
                          href=${`./book/chapter-${pad2(c.n)}.html`}
                        >
                          Leggi capitolo →
                        </a>
                        <div className="ff-caption text-black/50">refs: ${totalRefs}</div>
                      </div>
                    </div>
                  `;
                })}
              </div>`}
      </div>
    </div>
  </div>`;
};

export default BookOutlinePopup;
