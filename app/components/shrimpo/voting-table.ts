import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
//import type ShrimpoVote from 'datafruits13/models/shrimpo-vote';
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

  //vote: ShrimpoVote;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    const existingVote = this.args.entry.shrimpoVotes.find((vote: any) => {
      return vote.get('user.id') == this.currentUser.user.id;
    });
    console.log(existingVote);
    if(existingVote) {
      console.log(existingVote.score);
      //this.vote = existingVote;
      this.score = existingVote.score;
    }
  }

  @action
  async saveVote() {
    //console.log(this.vote.get('shrimpoEntry'));
    const vote = this.store.createRecord('shrimpo-vote', {
      shrimpoEntry: this.args.entry,
      score: this.score
    });
    try {
      await vote.save();
      console.log(vote);
      alert('saved shrimpo vote!');
    } catch (error) {
      console.log(vote);
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
