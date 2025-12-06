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
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-heading uppercase tracking-widest text-gray-400 mb-2">Support Futuro Fortissimo</div>
            <h3 className="text-2xl font-heading font-extrabold text-gray-900">Enjoying the archive?</h3>
            <p className="text-gray-500 mt-1">If this work is useful to you, consider supporting it. Even a small gesture keeps the project alive.</p>
          </div>
          <button onClick=${closeSupportPopup} className="text-gray-400 hover:text-black transition-colors">✕</button>
        </div>

        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="text-2xl">☕</div>
            <div>
              <div className="font-heading font-bold text-gray-900">Buy me a coffee</div>
              <p className="text-sm text-gray-600">Your support helps maintain and expand the archive.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="https://www.buymeacoffee.com/michelemerelli"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-black text-white py-2.5 rounded-lg font-heading font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg"
          >
            Support Now
          </a>
          <button
            onClick=${closeSupportPopup}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-heading font-semibold"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  </div>`;
};

export default SupportPopup;
