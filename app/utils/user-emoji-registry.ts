import emojiStrategy from 'datafruits13/emojiStrategy';

interface UserEmoji {
  name: string;
  imageUrl: string;
}

const userEmojiRegistry: { [shortname: string]: UserEmoji } = {};

/**
 * Register a user-uploaded custom emoji so it can be used in chat,
 * autocomplete, and the emoji picker.
 */
export function registerUserEmoji(name: string, imageUrl: string): void {
  const shortname = `:${name}:`;
  userEmojiRegistry[shortname] = { name, imageUrl };

  // Add to emojiStrategy so autocomplete and emoji picker can find it
  emojiStrategy[shortname] = {
    unicode: name,
    shortname: shortname,
    keywords: [name],
    custom: true,
    userUploaded: true,
    imageUrl: imageUrl,
  };
}

/**
 * Replace user-uploaded emoji shortnames in text with <img> tags.
 * Call this BEFORE emojione.shortnameToImage() so that emojione
 * skips the already-replaced <img> tags via its regex.
 */
export function replaceUserEmojis(text: string): string {
  for (const [shortname, emoji] of Object.entries(userEmojiRegistry)) {
    if (text.indexOf(shortname) === -1) continue;
    const escaped = shortname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const imgTag = `<img class="emojione" alt="${shortname}" src="${emoji.imageUrl}"/>`;
    text = text.replace(new RegExp(escaped, 'g'), imgTag);
  }
  return text;
}

export default userEmojiRegistry;
