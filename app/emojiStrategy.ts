export interface EmojiStrategyItem {
  unicode: string;
  shortname: string;
  keywords: string[];
  custom: boolean;
  animated: boolean;
  file?: string;
}

const emojiStrategy: Record<string, EmojiStrategyItem> = {};

export function registerEmoji(name: string, details: Partial<EmojiStrategyItem> = {}) {
  const cleanName = name.replace(/^:|:$/g, '');
  const shortname = `:${cleanName}:`;
  
  emojiStrategy[shortname] = {
    unicode: details.unicode || cleanName,
    shortname: cleanName,
    keywords: details.keywords || [],
    custom: true,
    animated: details.animated || details.file?.endsWith('.gif') || false,
    file: details.file || `${cleanName}.png`,
  };
}

export default emojiStrategy;