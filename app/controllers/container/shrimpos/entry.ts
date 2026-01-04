import Controller from '@ember/controller';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { inject as service } from '@ember/service';

export default class ContainerShrimposEntry extends Controller {
  declare model: ShrimpoEntry;
  @service declare currentUser: any;
  @service declare session: any;

  get scoreEmoji() {
    return formatEmojiHtml(this.model.shrimpoEmoji);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'container/shrimpos/entry': ContainerShrimposEntry;
  }
}
