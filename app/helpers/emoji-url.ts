import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type EmojiService from 'datafruits13/services/emoji';

export default class EmojiUrl extends Helper {
  @service declare emoji: EmojiService;

  compute(params: [string | undefined | null]): string {
    const input = params[0];
    if (!input) return '';
    return this.emoji?.urlFor(input) || '';
  }
}