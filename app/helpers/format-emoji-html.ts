import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

export function formatEmojiHtml(
  emojiNameOrArgs: string | undefined | null | [string | undefined | null]
): SafeString {
  // Handled for functional or direct calls if needed, but class handles templates
  const emojiName = Array.isArray(emojiNameOrArgs) ? emojiNameOrArgs[0] : emojiNameOrArgs;
  if (!emojiName) return htmlSafe('');
  return htmlSafe(`<img src="/emoji-zone/${emojiName.replace(/^:|:$/g, '').toLowerCase()}.png" class="inline-emoji" />`);
}

export default class FormatEmojiHtml extends Helper {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  compute(params: [string | undefined | null]): SafeString {
    const emojiName = params[0];
    if (!emojiName || !this.emojiZone) return htmlSafe('');

    return htmlSafe(this.emojiZone.htmlFor(emojiName));
  }
}