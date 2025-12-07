import { React, html } from './runtime.js';
import { TopicEmoji } from './types.js';

const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{238C}\u{2B05}-\u{2B07}\u{2190}-\u{2195}\u{200D}\u{200C}]/u;

export const extractEmojiAndTitle = (text) => {
  const match = text.match(emojiRegex);
  const emoji = match ? match[0] : '';
  const cleanTitle = text.replace(emojiRegex, '').trim();
  return { emoji, cleanTitle };
};

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

export const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) {
    return React.createElement(React.Fragment, null, text);
  }

  try {
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedHighlight})`, 'gi');
    const parts = text.split(regex);

    return React.createElement(
      React.Fragment,
      null,
      parts.map((part, i) =>
        regex.test(part)
          ? React.createElement('mark', { key: i, className: 'bg-yellow-200 text-black rounded-sm px-0.5 mx-0.5 font-medium' }, part)
          : part
      )
    );
  } catch (e) {
    return React.createElement(React.Fragment, null, text);
  }
};

const getTopicEmoji = (text) => {
  const lowerText = text.toLowerCase();

  if (lowerText.match(/(libro|libri|book|romanzo|biblioteca|lettura|letture)/)) return TopicEmoji.BOOKS;
  if (lowerText.match(/(soldi|finanza|crypto|bitcoin|investimenti|mercato|economi|pil|dollaro|euro|bank|banca|inflazione|prezzo)/)) return TopicEmoji.MONEY;
  if (lowerText.match(/(sport|calcio|maratona|corsa|olimpiadi|allenamento|atleta|nuoto|bici|sci)/)) return TopicEmoji.SPORT;
  if (lowerText.match(/(cibo|mangiare|dieta|pizza|hamburger|vino|ristorante|ricetta|cucina|pasta|carne|vegan|nutrizione)/)) return TopicEmoji.FOOD;
  if (lowerText.match(/(cervello|mente|intelligenza|pensiero|psicologia|filosofia|coscienza|neurale|studio)/)) return TopicEmoji.MIND;
  if (lowerText.match(/(medico|cura|vaccini|malattia|virus|covid|ospedale|salute|farmaco|genetica|dna|corpo)/)) return TopicEmoji.HEALTH;
  if (lowerText.match(/(arte|museo|dipinti|design|colore|creativ|artista|musica|canzone|spotify|netflix|film|cinema|foto)/)) return TopicEmoji.ART;
  if (lowerText.match(/(auto|tesla|guida|traffico|trasporti|bici|scooter|aereo|volare|razzo|spazio|mobilità)/)) return TopicEmoji.TRANSPORT;
  if (lowerText.match(/(metaverso|visore|realtà|virtuale|vr|ar|oculus|digitale|avatar|internet|web)/)) return TopicEmoji.VR;
  if (lowerText.match(/(società|persone|popolazione|generazione|demografia|guerra|pace|politica|storia|lavoro|donne|uomini|bambini)/)) return TopicEmoji.SOCIETY;
  if (lowerText.match(/(relax|stress|sonno|dormire|benessere|felicità|ansia|respiro)/)) return TopicEmoji.WELLNESS;
  if (lowerText.match(/(robot|ai|tech|app|computer|software|hardware|google|apple|amazon|facebook|meta|chatgpt|gpt|algoritmo)/)) return TopicEmoji.TECH;
  if (lowerText.match(/(clima|co2|inquinamento|natura|sostenibile|energia|solare|nucleare|ambiente|green|piante|albero)/)) return TopicEmoji.NATURE;

  return TopicEmoji.UNKNOWN;
};

const processSubchapter = (sub) => {
  const { emoji, cleanTitle } = extractEmojiAndTitle(sub.title);
  const analysisText = `${sub.title} ${sub.content}`;

  const mentionsBook =
    analysisText.includes('📚') ||
    /\b(libro|libri|book|romanzo|biblioteca|lettura|letture)\b/i.test(analysisText) ||
    sub.references?.some((ref) => /book|libro|amzn\.to|amazon\.\w+/i.test(`${ref.text} ${ref.url}`));

  return {
    ...sub,
    cleanTitle,
    originalEmoji: emoji || '📄',
    secondaryEmoji: getTopicEmoji(analysisText),
    mentionsBook
  };
};

export const processChapter = (chapter) => {
  const { emoji, cleanTitle } = extractEmojiAndTitle(chapter.title);

  return {
    ...chapter,
    cleanTitle,
    originalEmoji: emoji || '🎼',
    processedSubchapters: chapter.subchapters.map(processSubchapter)
  };
};
