import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { inject as service } from '@ember/service';

interface ShrimpoVotingTableArgs {
  entry: ShrimpoEntry;
}

export default class ShrimpoVotingTable extends Component<ShrimpoVotingTableArgs> {
  @service
  declare session: any;

  @service
  declare store: any;

  @tracked score: number = 1;

  @action
  async saveVote() {
    const vote = this.store.createRecord('shrimpo-vote', {
      shrimpoEntry: this.args.entry,
      score: this.score
    });
    console.log(vote.get('shrimpoEntry'));
    try {
      await vote.save();
      alert('saved shrimpo vote!');
    } catch (error) {
      console.log(error);
      alert('couldnt save vote!');
    }
  }

  @action
  setScore(event: any) {
    this.score = event.target.value;
  }

  get scoreEmoji() {
    return formatEmojiHtml(this.args.entry.shrimpoEmoji);
  }
}
