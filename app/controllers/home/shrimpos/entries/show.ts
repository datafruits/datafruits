import Controller from '@ember/controller';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { inject as service } from '@ember/service';
import EmojiService from 'datafruits13/services/emoji';

export default class HomeShrimposEntriesShow extends Controller {
  declare model: ShrimpoEntry;
  @service declare currentUser: any;
  @service declare session: any;
  @service declare emoji: EmojiService;

  get scoreEmoji() {
    return this.emoji.htmlFor(this.model.shrimpoEmoji);
  }
}
