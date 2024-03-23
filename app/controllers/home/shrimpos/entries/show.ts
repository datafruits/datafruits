import Controller from '@ember/controller';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { inject as service } from '@ember/service';

export default class HomeShrimposEntriesShow extends Controller {
  declare model: ShrimpoEntry;
  @service declare currentUser: any;

  get scoreEmoji() {
    return formatEmojiHtml(this.model.shrimpoEmoji);
  }
}
