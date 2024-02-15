import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
//import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

interface ShrimpoVotingTableArgs {
  entry: ShrimpoEntry;
}

export default class ShrimpoVotingTable extends Component<ShrimpoVotingTableArgs> {
  @tracked score: number = 1;

  @action
  setScore(event: any) {
    this.score = event.target.value;
  }

  // get scoreEmoji() {
  //   return formatEmojiHtml(this.args.entry.shrimpo.emoji);
  // }
}
