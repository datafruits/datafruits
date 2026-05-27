import { htmlSafe } from "@ember/template";
import emojione from 'emojione';
import userEmojiRegistry, { isEmojiAccessible } from 'datafruits13/utils/user-emoji-registry';

const titleAttributeRegex = /\s(title=.+)\s/;

export function formatEmojiHtml(emojiName) {
  // Check if this is a user-uploaded emoji
  const userEmoji = userEmojiRegistry[emojiName];
  if (userEmoji) {
    if (!isEmojiAccessible(emojiName)) {
      return htmlSafe(emojiName);
    }
    return htmlSafe(`<img class="emojione" alt="${emojiName}" src="${userEmoji.imageUrl}"/>`);
  }
  return htmlSafe(emojione.shortnameToImage(emojiName).replace(titleAttributeRegex, ""));
}