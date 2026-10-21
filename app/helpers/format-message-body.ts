import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

export default class FormatMessageBody extends Helper {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  compute(params: [string | undefined | null]): SafeString {
    const text = params[0];
    if (!text) return htmlSafe('');

    // Escape raw HTML characters to prevent XSS vulnerabilities
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Replace :shortname: only if it exists in the emoji map
    const parsedEmojis = escapedText.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => {
      const cleanName = name.toLowerCase();
      if (this.emojiZone?.emojiMap?.has(cleanName)) {
        return this.emojiZone.htmlFor(cleanName);
      }
      return match; // Leave system text, notifications, and emoticons untouched
    });

    // Restore URL linkification with secure target/rel attributes
    const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=_|!:,.;]*[-A-Z0-9+&@#\/%=_|])/ig;
    const linkedText = parsedEmojis.replace(urlPattern, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    return htmlSafe(linkedText);
  }
}