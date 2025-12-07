import { React, html } from '../runtime.js';
import { TopicEmoji } from '../types.js';

const Sidebar = ({ selectedEmoji, onSelect, vertical = true }) => {
  const prioritizedKeys = ['NATURE', 'TECH', 'WELLNESS'];
  const topicsMap = Object.entries(TopicEmoji).filter(([key]) => key !== 'UNKNOWN' && key !== 'BOOKS');

  const prioritizedTopics = prioritizedKeys
    .map((key) => topicsMap.find(([candidate]) => candidate === key))
    .filter(Boolean);
  const remainingTopics = topicsMap.filter(([key]) => !prioritizedKeys.includes(key));
  const topics = [...prioritizedTopics, ...remainingTopics];

  const containerClasses = vertical
    ? 'flex-col items-center gap-3'
    : 'flex-row flex-wrap items-center gap-3 px-2 justify-center';

  const itemClasses =
    'w-12 h-12 flex-shrink-0 flex items-center justify-center border-3 border-black text-black font-heading text-lg transition-all duration-150 shadow-[6px_6px_0_#000] hover:-translate-y-0.5';

  return html`<nav className=${`flex ${containerClasses} ${vertical ? 'sticky top-8' : ''}`}>
    <button
      onClick=${() => onSelect(null)}
      title="All Topics"
      className=${`${itemClasses} ${
        selectedEmoji === null
          ? 'bg-[var(--ff-blue)] text-black scale-105'
          : 'bg-white text-gray-600'
      }`}
    >
      <span className="text-lg">♾️</span>
    </button>

    <button
      onClick=${() => onSelect('BOOKS')}
      title="Libri citati"
      className=${`${itemClasses} ${
        selectedEmoji === 'BOOKS' ? 'bg-[var(--ff-yellow)] scale-105' : 'bg-white text-gray-700'
      }`}
    >
      <span className="text-xl leading-none">${TopicEmoji.BOOKS}</span>
    </button>

    ${topics.map(([key, emoji], index) => {
      const palette = ['bg-blue-100', 'bg-green-100', 'bg-red-100'];
      const backgroundClass = palette[index] || 'bg-white';

      return html`<button
        key=${key}
        onClick=${() => onSelect(emoji)}
        title=${key.toLowerCase()}
        className=${`${itemClasses} ${backgroundClass} ${
          selectedEmoji === emoji
            ? 'scale-105 shadow-[8px_8px_0_#000]'
            : 'text-gray-700'
        }`}
      >
        <span className="text-xl leading-none">${emoji}</span>
      </button>`;
    })}
  </nav>`;
};

export default Sidebar;
