
import React from 'react';
import { useNavigation } from '../NavigationContext';

const SupportPopup: React.FC = () => {
  const { showSupportPopup, closeSupportPopup } = useNavigation();

  if (!showSupportPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-300 border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full blur-xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
            <div className="text-5xl mb-4 drop-shadow-md">☕</div>
            <h3 className="font-heading text-2xl font-bold mb-2">Enjoying the content?</h3>
            <p className="text-blue-100 text-sm font-medium">Futuro Fortissimo is reader-supported.</p>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-8 font-normal leading-relaxed text-lg">
            If you found value in these stories, consider fueling the next chapter with a coffee. It helps keep the updates coming!
          </p>
          
          <div className="flex flex-col gap-3">
            <a 
              href="https://www.paypal.com/paypalme/MicheleMerelli" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={closeSupportPopup}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Support with a Coffee</span>
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
            
            <button 
              onClick={closeSupportPopup}
              className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl font-semibold transition-colors text-sm"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPopup;
