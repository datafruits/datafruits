import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import type EmojiService from 'datafruits13/services/emoji';

export default class FormatEmojiHtml extends Helper {
  @service declare emoji: EmojiService;

  compute(params: [string | undefined | null]): SafeString {
    const emojiName = params[0];
    if (!emojiName || !this.emoji) return htmlSafe('');

    return htmlSafe(this.emoji.htmlFor(emojiName));
  }
}