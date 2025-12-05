
import React, { useState, useEffect } from 'react';
import { ProcessedSubchapter } from '../types';
import { slugify, HighlightText } from '../utils';
import { useNavigation } from '../NavigationContext';

interface Props {
  subchapter: ProcessedSubchapter;
}

const isValidLink = (text: string, url: string) => {
  if (!text) return false;
  const lowerText = text.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  // Junk filters
  if (lowerText.includes('whatsapp')) return false;
  if (lowerText.includes('offrimi')) return false;
  if (lowerText.includes('caffè') || lowerText.includes('caffe')) return false;
  if (lowerText.includes('micmer')) return false;
  if (lowerText.includes('iscriviti')) return false;
  if (lowerText.includes('supportare questo progetto')) return false;
  if (lowerText.trim() === '☕') return false;
  if (lowerText.trim() === '❤️') return false;
  if (lowerText.trim() === '.') return false;
  
  // URL filters
  if (lowerUrl.includes('paypal')) return false;
  if (lowerUrl.includes('whatsapp')) return false;

  return true;
};

const isCrossReference = (text: string) => {
  return text.toLowerCase().includes('ff.');
};

const SubChapterItem: React.FC<Props> = ({ subchapter }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { debouncedSearchQuery, activeId, incrementInteraction } = useNavigation();
  const id = slugify(subchapter.cleanTitle);

  // Toggle expand logic with interaction tracking
  const toggleExpand = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    incrementInteraction();
    setIsExpanded(!isExpanded);
  };

  // Auto-expand if this item is clicked in nav
  useEffect(() => {
    if (activeId === id) {
      setIsExpanded(true);
    }
  }, [activeId, id]);

  // Auto-expand based on DEBOUNCED search query
  useEffect(() => {
    if (debouncedSearchQuery && (
      subchapter.cleanTitle.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || 
      subchapter.content.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    )) {
      setIsExpanded(true);
    } else if (!debouncedSearchQuery) {
      setIsExpanded(false);
    }
  }, [debouncedSearchQuery, subchapter]);

  const allLinks = [...subchapter.references, ...subchapter.connections];
  const crossReferences = allLinks.filter(ref => isValidLink(ref.text, ref.url) && isCrossReference(ref.text));
  const externalLinks = allLinks.filter(ref => isValidLink(ref.text, ref.url) && !isCrossReference(ref.text));
  const hasLinks = crossReferences.length > 0 || externalLinks.length > 0;

  return (
    <div id={id} className="relative pl-0 group mb-8 scroll-mt-32 transition-all duration-300">
      
      {/* Header Line */}
      <div 
        className="flex items-start sm:items-baseline gap-3 cursor-pointer hover:bg-gray-50 rounded-xl -ml-2 p-2 transition-colors select-none active:scale-[0.99] transform duration-100" 
        onClick={toggleExpand}
      >
        <span className="text-xl sm:text-2xl opacity-100 shrink-0 self-start leading-tight pt-1 sm:pt-0">{subchapter.originalEmoji}</span>
        
        <div className="flex-1 inline leading-snug">
          {/* Title Link */}
          <a 
            href={subchapter.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading text-lg sm:text-xl font-bold text-gray-900 hover:text-blue-600 hover:underline decoration-2 underline-offset-4 transition-colors mr-2 break-words"
            onClick={(e) => { e.stopPropagation(); incrementInteraction(); }}
          >
            <HighlightText text={subchapter.cleanTitle} highlight={debouncedSearchQuery} />
          </a>
          
          {/* Topic Filter Chip */}
          <span 
            className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-sm hover:bg-gray-200 hover:scale-110 transition-all cursor-default align-middle relative -top-0.5"
            title={`Topic: ${subchapter.secondaryEmoji}`}
            onClick={(e) => { e.stopPropagation(); incrementInteraction(); }}
          >
            {subchapter.secondaryEmoji}
          </span>
        </div>

        {/* Toggle Chevron */}
        <button 
          className="text-gray-400 hover:text-black transition-colors shrink-0 p-2 self-start active:bg-gray-100 rounded-full"
          aria-label="Toggle content"
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
      </div>

      {/* Collapsible Content Body */}
      <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-2 mb-6' : 'grid-rows-[0fr] opacity-0 mt-0 mb-0'}`}>
        <div className="overflow-hidden pl-1 md:pl-10">
          
          <div className="prose prose-lg prose-stone max-w-none mb-6 text-gray-800 leading-relaxed font-normal break-words">
            {subchapter.content.split('\n').map((paragraph, idx) => (
               paragraph.trim() && (
                 <p key={idx} className="mb-4 last:mb-0">
                   <HighlightText text={paragraph} highlight={debouncedSearchQuery} />
                 </p>
               )
            ))}
          </div>
          
          {/* Images */}
          {subchapter.images.length > 0 && (
            <div className={`grid gap-4 mb-6 ${subchapter.images.length > 1 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
              {subchapter.images.map((img, idx) => (
                <figure key={idx} className="space-y-2">
                  <img 
                    src={img.src} 
                    alt={img.caption || "Subchapter image"} 
                    className="w-full h-auto rounded-xl border border-gray-100 shadow-sm bg-gray-50"
                    loading="lazy"
                  />
                  {img.caption && (
                    <figcaption className="text-xs font-heading uppercase tracking-widest text-gray-500 font-bold pl-1">
                      {img.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Links - Always Visible */}
      {hasLinks && (
        <div className="pl-1 md:pl-10 mt-2 flex flex-col gap-3">
          
          {/* Cross References (Connections) */}
          {crossReferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {crossReferences.map((ref, idx) => (
                 <a 
                 key={idx}
                 href={ref.url}
                 target="_blank"
                 rel="noopener noreferrer"
                 onClick={incrementInteraction}
                 className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 hover:bg-blue-100 hover:border-blue-200 transition-all duration-200 active:scale-95"
               >
                 <span className="text-base">🔗</span>
                 <span className="text-sm font-bold text-blue-800 font-heading break-all">{ref.text}</span>
               </a>
              ))}
            </div>
          )}

          {/* External References */}
          {externalLinks.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {externalLinks.map((ref, idx) => (
                <a 
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={incrementInteraction}
                  className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 hover:bg-white hover:border-gray-400 hover:shadow-sm transition-all duration-200 active:scale-95"
                >
                  <span className="text-sm font-medium text-gray-700 group-hover:text-black border-b border-gray-300 group-hover:border-black transition-colors break-all">{ref.text}</span>
                  <span className="text-gray-400 group-hover:text-black text-sm">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubChapterItem;
