import Controller from '@ember/controller';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

export default class HomeShrimposEntriesShow extends Controller {
  declare model: ShrimpoEntry;

  get scoreEmoji() {
    return formatEmojiHtml(this.model.shrimpoEmoji);
  }
}
