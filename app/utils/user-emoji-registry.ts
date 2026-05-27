import emojiStrategy from 'datafruits13/emojiStrategy';

interface UserEmoji {
  name: string;
  imageUrl: string;
  emojiUsers?: string[];
}

interface UserEmojiRecord {
  name?: string | null;
  imageUrl?: string | null;
  emojiUsers?: string[] | null;
}

const userEmojiRegistry: { [shortname: string]: UserEmoji } = {};

let currentUsername: string | null = null;

export function setCurrentUsername(username: string | null): void {
  currentUsername = username;
}

export function isEmojiAccessible(shortname: string): boolean {
  const emoji = userEmojiRegistry[shortname];
  if (!emoji) return false;
  if (!emoji.emojiUsers || emoji.emojiUsers.length === 0) return true;
  if (!currentUsername) return false;
  return emoji.emojiUsers.includes(currentUsername);
}

/**
 * Register a user-uploaded custom emoji so it can be used in chat,
 * autocomplete, and the emoji picker.
 */
export function registerUserEmoji(name: string, imageUrl: string, emojiUsers?: string[]): void {
  console.log(`registerUserEmoji ${imageUrl} ${name}`);
  const shortname = `:${name}:`;
  userEmojiRegistry[shortname] = { name, imageUrl, emojiUsers };

  // Add to emojiStrategy so autocomplete and emoji picker can find it
  emojiStrategy[shortname] = {
    unicode: name,
    shortname: shortname,
    keywords: [name],
    custom: true,
    userUploaded: true,
    imageUrl: imageUrl,
    emojiUsers: emojiUsers,
  };
}

export function clearUserEmojis(): void {
  Object.keys(userEmojiRegistry).forEach((shortname) => {
    delete userEmojiRegistry[shortname];
  });

  Object.entries(emojiStrategy).forEach(([shortname, emoji]) => {
    if (emoji.userUploaded) {
      delete emojiStrategy[shortname];
    }
  });
}

export function syncUserEmojis(emojis: Iterable<UserEmojiRecord> | null | undefined): void {
  clearUserEmojis();

  for (const emoji of emojis ?? []) {
    if (emoji.name && emoji.imageUrl) {
      console.log(`registering user emoji ${emoji.name}`);
      registerUserEmoji(emoji.name, emoji.imageUrl, emoji.emojiUsers ?? undefined);
    }
  }
}

/**
 * Replace user-uploaded emoji shortnames in text with <img> tags.
 * Skips emojis that are locked (emojiUsers set) and current user is not in the list.
 * Call this BEFORE emojione.shortnameToImage() so that emojione
 * skips the already-replaced <img> tags via its regex.
 */
export function replaceUserEmojis(text: string): string {
  for (const [shortname, emoji] of Object.entries(userEmojiRegistry)) {
    console.log(`in replaceUserEmojis ${shortname} ${emoji}`);
    if (text.indexOf(shortname) === -1) continue;
    console.log(`is emoji accessible for me?: ${currentUsername}`, isEmojiAccessible(shortname));
    if (!isEmojiAccessible(shortname)) continue;
    const escaped = shortname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const imgTag = `<img class="emojione" alt="${shortname}" src="${emoji.imageUrl}"/>`;
    text = text.replace(new RegExp(escaped, 'g'), imgTag);
  }
  return text;
}

export default userEmojiRegistry;
