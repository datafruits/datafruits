import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

interface ShrimpoEntryCardArgs {
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoEntryCard extends Component<ShrimpoEntryCardArgs> {
  get scoreEmoji() {
    return formatEmojiHtml(this.args.shrimpoEntry.shrimpoEmoji);
  }
}
