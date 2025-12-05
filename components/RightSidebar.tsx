
import React, { useState, useMemo } from 'react';
import { ProcessedChapter } from '../types';
import { slugify, HighlightText } from '../utils';
import { useNavigation } from '../NavigationContext';

interface Props {
  chapters: ProcessedChapter[];
  isMobileMode?: boolean;
}

const RightSidebar: React.FC<Props> = ({ chapters, isMobileMode = false }) => {
  const { searchQuery, setSearchQuery, debouncedSearchQuery, setActiveId, setIsMobileMenuOpen, incrementInteraction } = useNavigation();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const handleNavigate = (id: string) => {
    incrementInteraction();
    setActiveId(id); 
    if (isMobileMode) setIsMobileMenuOpen(false);

    const element = document.getElementById(id);
    if (element) {
      // Small timeout to allow mobile menu close animation
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, isMobileMode ? 300 : 0);
    }
  };

  // Filter chapters based on DEBOUNCED query
  const filteredNav = useMemo(() => {
    if (!debouncedSearchQuery) return chapters;
    const lowerQuery = debouncedSearchQuery.toLowerCase();

    return chapters.map(chapter => {
      const chapterTitleMatch = chapter.cleanTitle.toLowerCase().includes(lowerQuery);
      const matchingSubchapters = chapter.processedSubchapters.filter(sub => {
        const titleMatch = sub.cleanTitle.toLowerCase().includes(lowerQuery);
        const contentMatch = sub.content.toLowerCase().includes(lowerQuery);
        return titleMatch || contentMatch;
      });

      if (chapterTitleMatch || matchingSubchapters.length > 0) {
        return {
          ...chapter,
          processedSubchapters: matchingSubchapters
        };
      }
      return null;
    }).filter(Boolean) as ProcessedChapter[];
  }, [chapters, debouncedSearchQuery]);

  return (
    <nav className={`h-full flex flex-col ${isMobileMode ? 'p-4 h-[85vh]' : 'sticky top-8 max-h-[90vh] pl-4 overflow-y-auto no-scrollbar'}`}>
      
      {/* Search Bar */}
      <div className={`mb-4 transition-all duration-300 ease-in-out flex items-center ${isSearchActive || searchQuery || isMobileMode ? 'w-full' : 'w-8'}`}>
        <div className="relative w-full flex items-center h-10">
           <button 
            onClick={() => setIsSearchActive(!isSearchActive)}
            className="z-10 p-2 text-gray-400 hover:text-black transition-colors absolute left-0"
            title="Search Index"
          >
             <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <input 
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onBlur={() => !searchQuery && !isMobileMode && setIsSearchActive(false)}
            className={`absolute left-0 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none text-sm font-medium transition-all duration-300 h-full w-full shadow-sm ${!isSearchActive && !searchQuery && !isMobileMode ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          />
        </div>
      </div>

      {/* Index Header */}
      <div className="mb-4 px-1">
        <h3 className="text-xs font-bold text-black uppercase tracking-widest border-b-2 border-black pb-1 inline-block">
          {debouncedSearchQuery ? 'Search Results' : 'Index'}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3 relative border-l border-gray-200 pl-4 flex-1 overflow-y-auto no-scrollbar">
        {filteredNav.map((chapter, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            {/* Main Chapter Link */}
            <button
              onClick={() => handleNavigate(chapter.url)}
              className="text-left w-full transition-all duration-200 hover:translate-x-1 py-1 group"
            >
              <span className={`block text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors leading-tight ${debouncedSearchQuery && chapter.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ? 'bg-yellow-100 text-black inline rounded px-1' : ''}`}>
                <HighlightText text={chapter.cleanTitle} highlight={debouncedSearchQuery} />
              </span>
            </button>

            {/* Subchapters Links */}
            <div className="flex flex-col border-l border-gray-100 pl-3 mt-0.5 gap-1.5">
              {chapter.processedSubchapters.map((sub, subIdx) => {
                const isMatch = debouncedSearchQuery && (
                  sub.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
                  sub.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
                );
                return (
                  <button
                    key={`${idx}-${subIdx}`}
                    onClick={() => handleNavigate(slugify(sub.cleanTitle))}
                    className="text-left w-full text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors py-0.5 leading-snug hover:translate-x-0.5 flex items-center gap-2 group"
                  >
                     <span className="text-[10px] opacity-70 grayscale group-hover:grayscale-0 transition-all">{sub.originalEmoji}</span>
                    <span className={isMatch ? 'bg-yellow-100 text-black rounded px-1' : ''}>
                      <HighlightText text={sub.cleanTitle} highlight={debouncedSearchQuery} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredNav.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs italic">No matches found.</p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default RightSidebar;
