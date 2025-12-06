import { React, html } from '../runtime.js';
import { useNavigation } from '../NavigationContext.js';

const SupportPopup = () => {
  const { showSupportPopup, closeSupportPopup } = useNavigation();

  React.useEffect(() => {
    const escapeHandler = (event) => {
      if (event.key === 'Escape') {
        closeSupportPopup();
      }
    };

    window.addEventListener('keydown', escapeHandler);
    return () => window.removeEventListener('keydown', escapeHandler);
  }, [closeSupportPopup]);

  if (!showSupportPopup) return null;

  return html`<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
    <div className="bg-white rounded-[30px] border-2 border-black shadow-[10px_10px_0px_#0f172a] max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="relative p-6 md:p-8 bg-gradient-to-br from-orange-50 via-white to-sky-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e5e7eb_1px,transparent_0)] [background-size:18px_18px] opacity-70 pointer-events-none"></div>
        <div className="relative space-y-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-[11px] font-heading uppercase tracking-[0.3em] text-gray-500 mb-2">Support Futuro Fortissimo</div>
              <h3 className="text-3xl font-heading font-black text-gray-900 leading-tight">Pop up powered like micmer</h3>
              <p className="text-gray-600 mt-2 text-sm md:text-base max-w-xl">Se ti piace l’archivio, regalagli energia. Ho preso in prestito il mood di micmer.giT per festeggiare ogni ff.x.y: scegli PayPal o passa dal sito per scoprire di più.</p>
            </div>
            <button onClick=${closeSupportPopup} className="h-10 w-10 rounded-xl border-2 border-black bg-white hover:-translate-y-0.5 transition-transform shadow-[4px_4px_0px_#0f172a] active:translate-y-0">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.paypal.com/paypalme/MicheleMerelli"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-4 flex flex-col gap-3 shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-transform"
            >
              <div className="absolute inset-0 bg-blue-50 opacity-70"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-3xl">💙</span>
                <div>
                  <div className="font-heading font-black text-gray-900 text-lg">PayPal pop</div>
                  <p className="text-xs text-gray-600">Il modo più rapido per mandare un grazie.</p>
                </div>
              </div>
              <div className="relative mt-auto text-sm font-heading uppercase tracking-[0.2em] text-blue-900">paypal.me/MicheleMerelli</div>
            </a>

            <a
              href="https://micmer-git.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden rounded-2xl border-2 border-black bg-white p-4 flex flex-col gap-3 shadow-[6px_6px_0px_#0f172a] hover:-translate-y-1 transition-transform"
            >
              <div className="absolute inset-0 bg-yellow-100 opacity-70"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-3xl">🟦</span>
                <div>
                  <div className="font-heading font-black text-gray-900 text-lg">micmer.giT</div>
                  <p className="text-xs text-gray-600">Visita il sito gemello per vibrazioni extra.</p>
                </div>
              </div>
              <div className="relative mt-auto text-sm font-heading uppercase tracking-[0.2em] text-gray-900">stile pop-up, griglia, blocky</div>
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.buymeacoffee.com/michelemerelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] text-center bg-black text-white py-3 rounded-xl font-heading font-bold uppercase tracking-[0.25em] hover:bg-gray-800 transition-colors shadow-[6px_6px_0px_#0f172a]"
            >
              Coffee boost
            </a>
            <button
              onClick=${closeSupportPopup}
              className="px-5 py-3 border-2 border-black rounded-xl text-gray-800 bg-white hover:-translate-y-0.5 transition-transform shadow-[6px_6px_0px_#0f172a] active:translate-y-0 font-heading font-semibold"
            >
              Più tardi
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

export default SupportPopup;
