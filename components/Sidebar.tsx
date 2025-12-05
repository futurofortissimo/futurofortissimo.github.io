
import React from 'react';
import { TopicEmoji } from '../types';

interface Props {
  selectedEmoji: string | null;
  onSelect: (emoji: string | null) => void;
  vertical?: boolean; // For desktop sidebar
}

const Sidebar: React.FC<Props> = ({ selectedEmoji, onSelect, vertical = true }) => {
  const topics = Object.entries(TopicEmoji);

  const containerClasses = vertical 
    ? "flex-col items-center gap-2" 
    : "flex-row items-center gap-3 px-2";

  const itemClasses = "w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-200 active:scale-90";

  return (
    <nav className={`flex ${containerClasses} ${vertical ? 'sticky top-8' : ''}`}>
      <button
        onClick={() => onSelect(null)}
        title="All Topics"
        className={`${itemClasses} ${
          selectedEmoji === null
            ? 'bg-black text-white shadow-md scale-105 ring-2 ring-black ring-offset-1'
            : 'bg-white border border-gray-100 text-gray-400 hover:text-black hover:bg-gray-50'
        }`}
      >
        <span className="text-lg">♾️</span>
      </button>

      {vertical && <div className="w-4 h-px bg-gray-200 my-2"></div>}
      {!vertical && <div className="h-4 w-px bg-gray-200 mx-1"></div>}

      {topics.map(([key, emoji]) => (
        <button
          key={key}
          onClick={() => onSelect(emoji)}
          title={key.toLowerCase()}
          className={`${itemClasses} ${
            selectedEmoji === emoji
              ? 'bg-gray-900 text-white shadow-md scale-105 ring-2 ring-gray-900 ring-offset-1'
              : 'bg-white border border-gray-100 text-gray-500 hover:text-black hover:bg-gray-50'
          }`}
        >
          <span className="text-xl leading-none">{emoji}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
