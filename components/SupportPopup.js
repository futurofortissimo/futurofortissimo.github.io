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
    <div className="bg-white border-4 border-black brutal-shadow max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300 no-round">
      <div className="relative p-6 md:p-8 bg-white accent-bar accent-blue">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
        <div className="relative space-y-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-[11px] font-heading uppercase tracking-[0.3em] text-black mb-2">Support Futuro Fortissimo</div>
              <h3 className="text-3xl font-heading font-black text-black leading-tight">Pop up powered like micmer</h3>
              <p className="text-black mt-2 text-sm md:text-base max-w-xl">Se ti piace l’archivio, regalagli energia. Ho preso in prestito il mood di micmer.giT per festeggiare ogni ff.x.y: scegli PayPal o passa dal sito per scoprire di più.</p>
            </div>
            <button onClick=${closeSupportPopup} className="h-12 w-12 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">✕</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://www.paypal.com/paypalme/MicheleMerelli"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden border-3 border-black bg-white p-4 flex flex-col gap-3 brutal-shadow hover:-translate-y-1 transition-transform no-round"
            >
              <div className="absolute inset-0 bg-blue-50 opacity-70"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-3xl">💙</span>
                <div>
                  <div className="font-heading font-black text-black text-lg">PayPal pop</div>
                  <p className="text-xs text-black/80">Il modo più rapido per mandare un grazie.</p>
                </div>
              </div>
              <div className="relative mt-auto text-sm font-heading uppercase tracking-[0.2em] text-black">paypal.me/MicheleMerelli</div>
            </a>

            <a
              href="https://micmer-git.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden border-3 border-black bg-white p-4 flex flex-col gap-3 brutal-shadow hover:-translate-y-1 transition-transform no-round"
            >
              <div className="absolute inset-0 bg-yellow-100 opacity-70"></div>
              <div className="relative flex items-center gap-3">
                <span className="text-3xl">🟦</span>
                <div>
                  <div className="font-heading font-black text-black text-lg">micmer.giT</div>
                  <p className="text-xs text-black/80">Visita il sito gemello per vibrazioni extra.</p>
                </div>
              </div>
              <div className="relative mt-auto text-sm font-heading uppercase tracking-[0.2em] text-black">stile pop-up, griglia, blocky</div>
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="https://www.buymeacoffee.com/michelemerelli"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] text-center bg-black text-white py-3 font-heading font-bold uppercase tracking-[0.25em] brutal-shadow hover:-translate-y-1 transition-transform"
            >
              Coffee boost
            </a>
            <button
              onClick=${closeSupportPopup}
              className="px-5 py-3 border-3 border-black text-black bg-white brutal-shadow hover:-translate-y-1 transition-transform font-heading font-semibold"
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
