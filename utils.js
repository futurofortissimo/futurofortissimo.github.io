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

const buildLinkLabel = (url, title) => {
  try {
    const { hostname } = new URL(url);
    const cleanHost = hostname.replace(/^www\./, '');
    return `Approfondimento ${cleanHost ? `(${cleanHost}) ` : ''}su ${title}`.trim();
  } catch (e) {
    return `Approfondimento su ${title}`;
  }
};

const normalizeLinks = (links = [], title) => {
  return links.map((ref) => {
    const cleanedText = (ref.text || '').trim();
    const hasValidText = cleanedText && cleanedText !== '.';

    return {
      ...ref,
      text: hasValidText ? cleanedText : buildLinkLabel(ref.url || '', title)
    };
  });
};

const generateSummary = (content = '') => {
  const firstParagraph = content
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .find(Boolean);

  if (!firstParagraph) return '';

  const sentenceMatch = firstParagraph.match(/[^.!?]+[.!?]/);
  const candidate = sentenceMatch ? sentenceMatch[0] : firstParagraph;
  const cleaned = candidate.replace(/\s+/g, ' ').trim();

  if (cleaned.length > 160) {
    return `${cleaned.slice(0, 157)}...`;
  }

  return cleaned;
};

const getTopicEmoji = (text) => {
  const lowerText = text.toLowerCase();

  if (lowerText.match(/(amzn\.to|libro|libri|book|romanzo|saggio|autore|lettura)/)) return TopicEmoji.BOOK;
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
  const normalizedTitle = cleanTitle;
  const processedReferences = normalizeLinks(sub.references || [], normalizedTitle);
  const processedConnections = normalizeLinks(sub.connections || [], normalizedTitle);
  const summary = generateSummary(sub.content || '');

  const referenceText = [...processedReferences, ...processedConnections]
    .map((ref) => `${ref.text || ''} ${ref.url || ''}`)
    .join(' ');
  const analysisText = `${sub.title} ${sub.content} ${referenceText}`;

  return {
    ...sub,
    cleanTitle: normalizedTitle,
    summary,
    originalEmoji: emoji || '📄',
    secondaryEmoji: getTopicEmoji(analysisText),
    references: processedReferences,
    connections: processedConnections
  };
};

export const mapTopicToTheme = (topicEmoji) => {
  if (topicEmoji === TopicEmoji.NATURE) return 'nature';
  if (topicEmoji === TopicEmoji.TECH || topicEmoji === TopicEmoji.VR || topicEmoji === TopicEmoji.TRANSPORT) return 'tech';
  if (
    topicEmoji === TopicEmoji.SOCIETY ||
    topicEmoji === TopicEmoji.WELLNESS ||
    topicEmoji === TopicEmoji.HEALTH ||
    topicEmoji === TopicEmoji.MIND
  )
    return 'heart';
  return null;
};

const determineChapterEmoji = (chapter, processedSubchapters, fallbackEmoji) => {
  const themeScores = { nature: 0, tech: 0, heart: 0 };

  processedSubchapters.forEach((sub) => {
    const baseTheme = mapTopicToTheme(sub.secondaryEmoji);
    if (baseTheme) {
      themeScores[baseTheme] += 2;
    }

    const contentTheme = mapTopicToTheme(getTopicEmoji(sub.content || ''));
    if (contentTheme) {
      themeScores[contentTheme] += 1;
    }
  });

  const chapterText = [chapter.title, chapter.subtitle, ...(chapter.keypoints || [])].join(' ');
  const chapterTheme = mapTopicToTheme(getTopicEmoji(chapterText));
  if (chapterTheme) {
    themeScores[chapterTheme] += 1;
  }

  const [topTheme, topScore] = Object.entries(themeScores).sort((a, b) => b[1] - a[1])[0];

  if (topScore === 0) return fallbackEmoji;

  const themeEmojiMap = {
    nature: '🍃',
    tech: '🖥️',
    heart: '❤️'
  };

  return themeEmojiMap[topTheme] || fallbackEmoji;
};

export const processChapter = (chapter) => {
  const { emoji, cleanTitle } = extractEmojiAndTitle(chapter.title);
  const processedSubchapters = chapter.subchapters.map(processSubchapter);
  const fallbackEmoji = emoji || '🎼';

  return {
    ...chapter,
    cleanTitle,
    originalEmoji: fallbackEmoji,
    primaryEmoji: determineChapterEmoji(chapter, processedSubchapters, fallbackEmoji),
    processedSubchapters
  };
};
