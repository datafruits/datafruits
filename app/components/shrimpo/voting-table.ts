import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVote from 'datafruits13/models/shrimpo-vote';
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

  @service
  declare currentUser: any;

  @tracked score: number = 1;

  vote: ShrimpoVote;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    const existingVote = this.args.entry.shrimpoVotes.find((vote: ShrimpoVote) => {
      return vote.user == this.currentUser.user;
    });
    if(existingVote) {
      this.vote = existingVote;
    } else {
      this.vote = this.store.createRecord('shrimpo-vote', {
        shrimpoEntry: this.args.entry,
        score: this.score
      });
    }
  }

  @action
  async saveVote() {
    console.log(this.vote.get('shrimpoEntry'));
    try {
      await this.vote.save();
      console.log(this.vote);
      alert('saved shrimpo vote!');
    } catch (error) {
      console.log(this.vote);
      console.log(error);
      console.trace();
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
