import { React, html } from '../runtime.js';

const BookOutlinePopup = ({ onClose }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(`./generated/book/outline.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));
  }, []);

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label="Outline libro" className="relative max-w-5xl w-full">
      <div className="absolute right-4 top-4 z-10">
        <button onClick=${onClose} className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform">
          Chiudi
        </button>
      </div>

      <div className="border-3 border-black bg-white brutal-shadow p-6 max-h-[80vh] overflow-auto">
        <div className="ff-eyebrow-md text-black/80">Libro / mini‑saggi</div>
        <h2 className="ff-heading-xl mt-2">14 capitoli (outline)</h2>
        <p className="ff-body text-black/70 mt-2">Struttura consequenziale: tech → cultura/simulazione → attenzione/salute → materiale/politico.</p>

        ${!data
          ? html`<p className="mt-6">Caricamento…</p>`
          : data.error
            ? html`<p className="mt-6">Errore caricamento outline.</p>`
            : html`<ol className="mt-6 space-y-5">
                ${(data.chapters || []).map((c) => html`
                  <li className="border-3 border-black p-4 brutal-shadow">
                    <div className="ff-caption text-black/70">Capitolo ${c.n}</div>
                    <div className="text-lg font-bold mt-1">${c.title}</div>
                    <div className="ff-body mt-2 text-black/80">${c.thesis}</div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      ${(c.refs || []).map((r) => html`<span className="px-2 py-1 border-3 border-black text-xs ff-button bg-white">${r}</span>`)}
                    </div>
                  </li>
                `)}
              </ol>`}
      </div>
    </div>
  </div>`;
};

export default BookOutlinePopup;
