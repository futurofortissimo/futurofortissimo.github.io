import { React, html } from '../runtime.js';
import { TopicEmoji } from '../types.js';

const Sidebar = ({ selectedEmoji, onSelect, vertical = true }) => {
  const topics = Object.entries(TopicEmoji);

  const containerClasses = vertical
    ? 'flex-col items-center gap-3'
    : 'flex-row flex-wrap items-center gap-3 px-2 justify-center';

  const itemClasses =
    'w-12 h-12 flex-shrink-0 flex items-center justify-center border-3 border-black bg-white text-black font-heading text-lg transition-all duration-150 shadow-[6px_6px_0_#000] hover:-translate-y-0.5';

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

    ${vertical
      ? html`<div className="w-px h-6 bg-black"></div>`
      : html`<div className="h-px w-6 bg-black"></div>`}

    ${topics.map(([key, emoji]) => html`<button
      key=${key}
      onClick=${() => onSelect(emoji)}
      title=${key.toLowerCase()}
      className=${`${itemClasses} ${
        selectedEmoji === emoji
          ? 'bg-yellow-300 text-black scale-105'
          : 'bg-white text-gray-700'
      }`}
    >
      <span className="text-xl leading-none">${emoji}</span>
    </button>`)}
  </nav>`;
};

export default Sidebar;
