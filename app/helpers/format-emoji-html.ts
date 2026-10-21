import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

export default class FormatEmojiHtml extends Helper {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  compute(params: [string | undefined | null]): SafeString {
    const emojiName = params[0];
    if (!emojiName || !this.emojiZone) return htmlSafe('');

    return htmlSafe(this.emojiZone.htmlFor(emojiName));
  }
}