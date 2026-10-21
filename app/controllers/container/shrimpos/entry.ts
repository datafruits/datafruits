import Controller from '@ember/controller';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { inject as service } from '@ember/service';
import EmojiZoneService from 'datafruits13/services/emoji-zone';

export default class ContainerShrimposEntry extends Controller {
  declare model: ShrimpoEntry;
  @service declare currentUser: any;
  @service declare session: any;
  @service('emoji-zone') declare emojiZone: EmojiZoneService

  get scoreEmoji() {
    return this.emojiZone.htmlFor(this.model.shrimpoEmoji);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'container/shrimpos/entry': ContainerShrimposEntry;
  }
}
