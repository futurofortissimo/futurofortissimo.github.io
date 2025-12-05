import React from 'react';
import { ProcessedChapter } from '../types';
import SubChapterItem from './SubChapterItem';

interface Props {
  chapter: ProcessedChapter;
}

const ChapterItem: React.FC<Props> = ({ chapter }) => {
  return (
    <article id={chapter.url} className="mb-20 scroll-mt-24 border-b-2 border-gray-100 pb-12 last:border-0">
      {/* Editorial Header */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-3xl select-none grayscale opacity-90 leading-none self-center">{chapter.originalEmoji}</span>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            <a href={chapter.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-700 transition-colors">
              {chapter.cleanTitle}
            </a>
          </h2>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-8 pl-[3.5rem]">
          {chapter.subtitle}
        </p>

        {/* Keypoints - Vertical List */}
        {chapter.keypoints.length > 0 && (
          <div className="pl-[3.5rem] mb-10">
            <ul className="space-y-3">
              {chapter.keypoints.map((point, idx) => (
                <li 
                  key={idx} 
                  className="text-lg text-gray-800 font-normal flex items-start gap-3 leading-snug font-heading"
                >
                  <span className="mt-2 w-1.5 h-1.5 bg-gray-900 rounded-full shrink-0 opacity-60"></span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Subchapters List */}
      <div className="space-y-6 pl-0 md:pl-[3.5rem]">
        {chapter.processedSubchapters.map((sub, idx) => (
          <SubChapterItem 
            key={idx} 
            subchapter={sub} 
          />
        ))}
      </div>
    </article>
  );
};

export default ChapterItem;