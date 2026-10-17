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

    // Replace :shortname: only if it exists in the emoji map
    const parsed = text.replace(/:([a-zA-Z0-9_+-]+):/g, (match, name) => {
      const cleanName = name.toLowerCase();
      if (this.emojiZone?.emojiMap?.has(cleanName)) {
        return this.emojiZone.htmlFor(cleanName);
      }
      return match; // Leave system text, notifications, and emoticons untouched
    });

    return htmlSafe(parsed);
  }
}