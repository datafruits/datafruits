import { htmlSafe } from "@ember/template";
import emojione from 'emojione';

const titleAttributeRegex = /\s(title=.+)\s/;

export function formatEmojiHtml(emojiName) {
  return htmlSafe(emojione.shortnameToImage(emojiName).replace(titleAttributeRegex, ""));
}