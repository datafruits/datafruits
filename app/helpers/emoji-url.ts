import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import EmojiService from 'datafruits13/services/emoji';

export default class EmojiUrlHelper extends Helper {
  @service declare emoji: EmojiService;

  compute([name]: [string]): string {
    return this.emoji ? this.emoji.urlFor(name) : '';
  }
}