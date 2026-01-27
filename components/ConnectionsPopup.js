import { React, html } from '../runtime.js';

const ConnectionsPopup = ({ onClose }) => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(`./generated/connections.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));
  }, []);

  const hubs = data?.topHubs ? data.topHubs.slice(0, 25) : [];

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label="Connessioni" className="relative max-w-5xl w-full">
      <div className="absolute right-4 top-4 z-10">
        <button onClick=${onClose} className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform">
          Chiudi
        </button>
      </div>

      <div className="border-3 border-black bg-white brutal-shadow p-6 max-h-[80vh] overflow-auto">
        <div className="ff-eyebrow-md text-black/80">Connessioni</div>
        <h2 className="ff-heading-xl mt-2">Connessioni fortissime</h2>
        <p className="ff-body text-black/70 mt-2">Hub più citati nel grafo <span className="ff-caption">connections</span> dei subcapitoli.</p>

        ${!data
          ? html`<p className="mt-6">Caricamento…</p>`
          : data.error
            ? html`<p className="mt-6">Errore caricamento connessioni.</p>`
            : html`<ol className="mt-6 space-y-4">
                ${hubs.map((h) => html`
                  <li className="border-3 border-black p-4 brutal-shadow">
                    <div className="ff-caption text-black/70">${h.id} · score ${h.score}</div>
                    <div className="text-lg font-bold mt-1">${(h.label || h.id).replace(/\s+/g, ' ')}</div>
                    ${h.url
                      ? html`<div className="mt-2"><a className="underline" href=${h.url} target="_blank" rel="noopener noreferrer">Apri</a></div>`
                      : null}
                  </li>
                `)}
              </ol>`}
      </div>
    </div>
  </div>`;
};

export default ConnectionsPopup;
