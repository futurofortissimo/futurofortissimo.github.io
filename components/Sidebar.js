import { React, html } from '../runtime.js';
import { TopicEmoji } from '../types.js';

const Sidebar = ({ selectedEmoji, onSelect, vertical = true }) => {
  const prioritizedKeys = ['NATURE', 'TECH', 'WELLNESS'];
  const topicsMap = Object.entries(TopicEmoji).filter(([key]) => key !== 'UNKNOWN');

  const prioritizedTopics = prioritizedKeys
    .map((key) => topicsMap.find(([candidate]) => candidate === key))
    .filter(Boolean);
  const remainingTopics = topicsMap.filter(([key]) => !prioritizedKeys.includes(key));
  const topics = [...prioritizedTopics, ...remainingTopics];

  const containerClasses = vertical
    ? 'flex-col items-center gap-3'
    : 'flex-row items-center gap-3 px-2 justify-start overflow-x-auto whitespace-nowrap no-scrollbar';

  const itemClasses =
    'ff-topic w-12 h-12 flex-shrink-0 flex items-center justify-center text-black font-heading text-lg transition-all duration-150';

  return html`<nav className=${`flex ${containerClasses} ${vertical ? 'sticky top-8' : ''}`}>
    <button
      onClick=${() => onSelect(null)}
      title="All Topics"
      className=${`${itemClasses} ${
        selectedEmoji === null
          ? 'is-on text-black'
          : 'text-gray-600'
      }`}
    >
      <span className="text-lg">♾️</span>
    </button>

    ${topics.map(([key, emoji], index) => {
      const backgroundClass = '';

      return html`<button
        key=${key}
        onClick=${() => onSelect(emoji)}
        title=${key.toLowerCase()}
        className=${`${itemClasses} ${backgroundClass} ${
          selectedEmoji === emoji
            ? 'is-on'
            : 'text-gray-700'
        }`}
      >
        <span className="text-xl leading-none">${emoji}</span>
      </button>`;
    })}
  </nav>`;
};

export default Sidebar;
