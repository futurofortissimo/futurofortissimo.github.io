export interface Reference {
  text: string;
  url: string;
}

export interface Connection {
  text: string;
  url: string;
}

export interface Image {
  src: string;
  caption?: string;
}

export interface Subchapter {
  title: string;
  link: string;
  content: string;
  images: Image[];
  references: Reference[];
  connections: Connection[];
}

export interface Chapter {
  url: string;
  title: string;
  subtitle: string;
  keypoints: string[];
  subchapters: Subchapter[];
}

// Secondary Emojis for Topics
export enum TopicEmoji {
  MONEY = '💸',
  SPORT = '⚽',
  FOOD = '🍽',
  MIND = '🧠',
  HEALTH = '💊',
  ART = '🎨',
  TRANSPORT = '🚕',
  VR = '🥽',
  SOCIETY = '👥',
  WELLNESS = '💆',
  TECH = '💻',
  NATURE = '🍃',
  UNKNOWN = '✨'
}

export interface ProcessedSubchapter extends Subchapter {
  cleanTitle: string;
  originalEmoji: string; // The emoji extracted from the title (Prima Emoji)
  secondaryEmoji: TopicEmoji; // The inferred topic emoji (Seconda Emoji)
}

export interface ProcessedChapter extends Chapter {
  cleanTitle: string;
  originalEmoji: string;
  processedSubchapters: ProcessedSubchapter[];
}