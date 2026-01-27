import { React, html } from '../runtime.js';

const ThemesPopup = ({ onClose }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(`./generated/themes.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));
  }, []);

  const themes = data?.themes ? [...data.themes].sort((a, b) => b.count - a.count) : [];

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label="Macro-temi" className="relative max-w-5xl w-full">
      <div className="absolute right-4 top-4 z-10">
        <button onClick=${onClose} className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform">
          Chiudi
        </button>
      </div>

      <div className="border-3 border-black bg-white brutal-shadow p-6 max-h-[80vh] overflow-auto">
        <div className="ff-eyebrow-md text-black/80">Macro‑temi</div>
        <h2 className="ff-heading-xl mt-2">Indice dei temi ricorrenti</h2>
        <p className="ff-body text-black/70 mt-2">Classificazione automatica (keyword) per navigare il corpus.</p>

        ${!data
          ? html`<p className="mt-6">Caricamento…</p>`
          : data.error
            ? html`<p className="mt-6">Errore caricamento macro‑temi.</p>`
            : html`<div className="mt-6 space-y-5">
                ${themes.map((t) => html`
                  <article className="border-3 border-black p-4 brutal-shadow">
                    <div className="ff-caption text-black/70">${t.key} · occorrenze: ${t.count}</div>
                    <div className="text-lg font-bold mt-1">${t.name}</div>
                    <div className="mt-3">
                      <div className="ff-caption text-black/60">Esempi</div>
                      <ul className="mt-2 space-y-1">
                        ${(t.samples || []).slice(0, 6).map((s) => html`
                          <li>
                            <a className="underline" href=${s.url} target="_blank" rel="noopener noreferrer">${s.title}</a>
                            <span className="text-black/60 ff-caption"> ${s.id || ''}</span>
                          </li>
                        `)}
                      </ul>
                    </div>
                  </article>
                `)}
              </div>`}
      </div>
    </div>
  </div>`;
};

export default ThemesPopup;
