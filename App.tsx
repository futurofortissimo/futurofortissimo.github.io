
import React, { useState, useEffect, useMemo } from 'react';
import { rawData } from './data';
import { processChapter } from './utils';
import { ProcessedChapter } from './types';
import ChapterItem from './components/ChapterItem';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';
import SupportPopup from './components/SupportPopup';
import { NavigationProvider, useNavigation } from './NavigationContext';

const InnerApp: React.FC = () => {
  const [processedData, setProcessedData] = useState<ProcessedChapter[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const { isMobileMenuOpen, setIsMobileMenuOpen, incrementInteraction } = useNavigation();

  // Initial load
  useEffect(() => {
    const processed = rawData.map(processChapter);
    setProcessedData(processed);
  }, []);

  // Filtering Logic
  const filteredData = useMemo(() => {
    if (!selectedEmoji) return processedData;

    return processedData.map(chapter => {
      const matchingSubchapters = chapter.processedSubchapters.filter(
        sub => sub.secondaryEmoji === selectedEmoji
      );
      
      if (matchingSubchapters.length > 0) {
        return {
          ...chapter,
          processedSubchapters: matchingSubchapters
        };
      }
      return null;
    }).filter(Boolean) as ProcessedChapter[];
  }, [processedData, selectedEmoji]);

  const handleTopicSelect = (emoji: string | null) => {
    incrementInteraction();
    setSelectedEmoji(emoji);
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 relative selection:bg-yellow-200 selection:text-black">
      <SupportPopup />

      {/* Mobile Header & Filters */}
      <div className="lg:hidden bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="px-5 py-3 flex justify-between items-center">
          <span 
            className="font-heading font-bold text-lg tracking-tight cursor-pointer"
            onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
          >
            Futuro Fortissimo
          </span>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors active:bg-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
        
        {/* Mobile Horizontal Filter Bar */}
        <div className="px-5 pb-3 overflow-x-auto no-scrollbar">
           <div className="flex w-max">
             <Sidebar selectedEmoji={selectedEmoji} onSelect={handleTopicSelect} vertical={false} />
           </div>
        </div>
      </div>

      {/* Mobile Search Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl p-6 transform transition-transform animate-in slide-in-from-right duration-300 rounded-l-2xl border-l border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="font-heading font-bold text-lg">Search & Index</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                ✕
              </button>
            </div>
            <RightSidebar chapters={filteredData} isMobileMode={true} />
          </div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-0">
          
          {/* Left Sidebar (Desktop Icons) */}
          <aside className="hidden lg:block w-20 shrink-0 pt-10 h-screen sticky top-0 z-20 pl-4">
            <Sidebar selectedEmoji={selectedEmoji} onSelect={handleTopicSelect} vertical={true} />
          </aside>

          {/* Main Feed */}
          <main className="flex-1 min-w-0 pt-12 px-5 md:px-12 max-w-4xl mx-auto border-l border-r border-gray-50/50 min-h-screen">
            
            {/* Header */}
            <header className="mb-12 pl-0 md:pl-[3.25rem]">
              <h1 className="text-4xl md:text-6xl font-extrabold font-heading text-black mb-4 tracking-tighter leading-none">
                Futuro<br/>Fortissimo
              </h1>
              <p className="text-lg text-gray-400 font-serif italic">
                A chronological archive of the future.
                {selectedEmoji && (
                  <span className="not-italic ml-3 text-black bg-gray-100 px-3 py-1 rounded-full text-[10px] font-heading font-bold uppercase tracking-widest inline-flex items-center gap-2 cursor-pointer hover:bg-gray-200 transition-colors transform translate-y-[-2px]" onClick={() => handleTopicSelect(null)}>
                    <span>{selectedEmoji}</span> Filter Active
                    <span className="hover:text-red-500">✕</span>
                  </span>
                )}
              </p>
            </header>

            {/* Feed */}
            <div className="space-y-12">
              {filteredData.length > 0 ? (
                filteredData.map((chapter, index) => (
                  <ChapterItem key={`${chapter.url}-${index}`} chapter={chapter} />
                ))
              ) : (
                <div className="py-24 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <span className="text-5xl block mb-4 grayscale opacity-20">🔍</span>
                  <p className="text-lg text-gray-400 font-serif italic mb-6">No stories found for this topic.</p>
                  <button 
                    onClick={() => handleTopicSelect(null)}
                    className="px-6 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            <footer className="mt-24 mb-12 pt-8 border-t border-gray-100 text-center text-gray-300 text-[10px] font-heading uppercase tracking-widest">
              Futuro Fortissimo Archive • Built with ❤️ & 🤖
            </footer>
          </main>

          {/* Right Sidebar (Desktop Navigation) */}
          <aside className="hidden xl:block w-72 shrink-0 pt-12 pr-6 h-screen sticky top-0 z-10">
             <RightSidebar chapters={filteredData} />
          </aside>

        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <NavigationProvider>
      <InnerApp />
    </NavigationProvider>
  );
};

export default App;
