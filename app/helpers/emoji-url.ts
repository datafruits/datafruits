import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

export default class EmojiUrlHelper extends Helper {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  compute([name]: [string]): string {
    return this.emojiZone ? this.emojiZone.urlFor(name) : '';
  }
}