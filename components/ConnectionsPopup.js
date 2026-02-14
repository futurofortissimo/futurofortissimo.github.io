import { React, html } from '../runtime.js';
import { t } from '../i18n.js';

const ConnectionsPopup = ({ onClose }) => {
  const [data, setData] = React.useState(null);

  const [suggested, setSuggested] = React.useState(null);

  React.useEffect(() => {
    fetch(`./generated/connections.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData({ error: true }));

    fetch(`./generated/suggested_connections.json?ts=${Date.now()}`)
      .then((r) => r.json())
      .then(setSuggested)
      .catch(() => setSuggested({ error: true }));
  }, []);

  const hubs = data?.topHubs ? data.topHubs.slice(0, 25) : [];
  const suggestedPacks = suggested?.suggestions ? suggested.suggestions.slice(0, 3) : [];

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div role="dialog" aria-modal="true" aria-label=${t('connections')} className="relative max-w-5xl w-full">
      <div className="absolute right-4 top-4 z-10">
        <button onClick=${onClose} className="px-4 py-2 border-3 border-black bg-white ff-button hover:-translate-y-0.5 transition-transform">
          ${t('close')}
        </button>
      </div>

      <div className="border-3 border-black bg-white brutal-shadow p-6 max-h-[80vh] overflow-auto">
        <div className="ff-eyebrow-md text-black/80">${t('connections')}</div>
        <h2 className="ff-heading-xl mt-2">${t('strongestConnections')}</h2>
        <p className="ff-body text-black/70 mt-2">${t('connectionsHint')} <span className="ff-caption">${t('connectionsLabel')}</span>.</p>

        ${!data
          ? html`<p className="mt-6">${t('loading')}</p>`
          : data.error
            ? html`<p className="mt-6">${t('errorConnections')}</p>`
            : html`<ol className="mt-6 space-y-4">
                ${hubs.map((h) => html`
                  <li className="border-3 border-black p-4 brutal-shadow">
                    <div className="ff-caption text-black/70">${h.id} · score ${h.score}</div>
                    <div className="text-lg font-bold mt-1">${(h.label || h.id).replace(/\s+/g, ' ')}</div>
                    ${h.url
                      ? html`<div className="mt-2"><a className="underline" href=${h.url} target="_blank" rel="noopener noreferrer">${t('open')}</a></div>`
                      : null}
                  </li>
                `)}
              </ol>`}

        <div className="mt-10">
          <div className="ff-eyebrow-md text-black/80">${t('suggestedConnectionsAuto')}</div>
          <h3 className="ff-heading-lg mt-2">${t('readyBridges')}</h3>
          <p className="ff-body text-black/70 mt-2">${t('bridgesHint')}</p>

          ${!suggested
            ? html`<p className="mt-6">${t('loading')}</p>`
            : suggested.error
              ? html`<p className="mt-6">${t('errorSuggestions')}</p>`
              : suggestedPacks.length
                ? html`<div className="mt-6 space-y-6">
                    ${suggestedPacks.map((p) => html`
                      <section className="border-3 border-black p-4 brutal-shadow bg-[rgba(0,0,0,0.02)]">
                        <div className="ff-caption text-black/70">${p.key}</div>
                        <div className="text-lg font-bold mt-1">${p.title}</div>
                        <ol className="mt-4 space-y-3">
                          ${(p.items || []).slice(0, 6).map((it) => html`
                            <li className="border-3 border-black p-3 brutal-shadow bg-white">
                              <div className="ff-caption text-black/70">${it.from?.id} → ${it.to?.id} · strength ${it.strength}</div>
                              <div className="ff-body mt-2">${(it.bridge || '').trim()}</div>
                              <div className="mt-2 flex flex-wrap gap-3">
                                ${it.from?.url ? html`<a className="underline" href=${it.from.url} target="_blank" rel="noopener noreferrer">${t('openSource')}</a>` : null}
                                ${it.to?.url ? html`<a className="underline" href=${it.to.url} target="_blank" rel="noopener noreferrer">${t('openDest')}</a>` : null}
                              </div>
                            </li>
                          `)}
                        </ol>
                      </section>
                    `)}
                  </div>`
                : html`<p className="mt-6">${t('noSuggested')}</p>`}
        </div>
      </div>
    </div>
  </div>`;
};

export default ConnectionsPopup;
