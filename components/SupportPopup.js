import { React, html } from '../runtime.js';
import { useNavigation } from '../NavigationContext.js';
import { t } from '../i18n.js';

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

  return html`<div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
    <div className="bg-white border-4 border-black brutal-shadow max-w-xl w-full overflow-y-auto max-h-[90dvh] animate-in fade-in zoom-in-95 duration-300 no-round my-auto">
      <div className="relative p-6 md:p-8 bg-white accent-bar accent-blue">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>
        <div className="relative space-y-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="ff-eyebrow text-black mb-2">${t('support')}</div>
              <h3 className="ff-heading-xl font-heading text-black">${t('supportTitle')}</h3>
              <p className="text-black mt-2 ff-body-sm max-w-xl">${t('supportText')}</p>
            </div>
            <button onClick=${closeSupportPopup} className="h-12 w-12 border-3 border-black bg-white brutal-shadow hover:-translate-y-1 transition-transform">✕</button>
          </div>

          <a
            href="https://www.paypal.com/paypalme/MicheleMerelli"
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden border-3 border-black bg-white p-5 flex flex-col gap-3 brutal-shadow hover:-translate-y-1 transition-transform no-round"
          >
            <div className="absolute inset-0 bg-blue-50 opacity-70"></div>
            <div className="relative flex items-center gap-3">
              <span className="text-3xl">💙</span>
              <div>
                <div className="font-heading ff-heading-md text-black">PayPal</div>
                <p className="ff-body-sm text-black/80">${t('paypalHint')}</p>
              </div>
            </div>
            <div className="relative mt-auto ff-eyebrow-md text-black">paypal.me/MicheleMerelli</div>
          </a>

          <div className="flex flex-wrap gap-3">
            <button
              onClick=${closeSupportPopup}
              className="flex-1 min-w-[140px] px-5 py-3 border-3 border-black text-black bg-white brutal-shadow hover:-translate-y-1 transition-transform font-heading font-semibold"
            >
              ${t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;
};

export default SupportPopup;
