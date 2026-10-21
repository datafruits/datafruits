import Helper from '@ember/component/helper';
import { service } from '@ember/service';
// @ts-expect-error: showdown lacks full type definitions
import showdown from 'showdown';
import { htmlSafe } from '@ember/template';
import type { SafeString } from '@ember/template';
import { isBlank, isEmpty } from '@ember/utils';
import type EmojiService from 'datafruits13/services/emoji';

export default class EmojiMarkedDown extends Helper {
  @service('emoji') declare emoji: EmojiService;

  compute(params: [string | undefined | null]): SafeString {
    const input = params[0];
    if (isEmpty(input) || isBlank(input)) {
      return htmlSafe('');
    }

    const emojiMap = this.emoji?.emojiMap;
    let text = String(input);

    // Replace valid custom emoji shortcodes
    if (this.emoji && emojiMap && emojiMap.size > 0) {
      text = text.replace(/:([a-zA-Z0-9_+-]+):/g, (match: string, name: string) => {
        const html = this.emoji.htmlFor(name);
        return html || match;
      });
    }

    try {
      const ConverterClass = (showdown as unknown as { Converter: typeof showdown.Converter }).Converter || (showdown as unknown as { default: typeof showdown.Converter }).default;
      const converter = new ConverterClass({ simplifiedAutoLink: true });
      const html = converter.makeHtml(text);

      return htmlSafe(html);
    } catch (e) {
      console.error('[EmojiMarkedDown] Error parsing markdown:', e);
      return htmlSafe(text);
    }
  }
}