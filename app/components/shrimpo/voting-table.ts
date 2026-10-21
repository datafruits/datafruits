import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type EmojiService from 'datafruits13/services/emoji';

interface ShrimpoVotingTableArgs {
  entry: ShrimpoEntry;
  votingCompletionPercentage: number;
}

export default class ShrimpoVotingTable extends Component<ShrimpoVotingTableArgs> {
  @service
  declare session: any;

  @service
  declare store: any;

  @service
  declare currentUser: any;

  @service('emoji')
  declare emoji: EmojiService;

  @tracked score: number = 1;
  @tracked voted: boolean = false;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    const existingVote = this.args.entry.shrimpoVotes.find((vote: any) => {
      return vote.get('user.id') == this.currentUser.user.id;
    });
    if (existingVote) {
      this.score = existingVote.score;
      this.voted = true;
    }
  }

  @action
  async saveVote() {
    const vote = this.store.createRecord('shrimpo-vote', {
      shrimpoEntry: this.args.entry,
      score: this.score
    });
    try {
      await vote.save();
      alert('saved shrimpo vote!');
      this.voted = true;
    } catch (error) {
      console.log(error);
      alert('couldnt save vote!');
    }
  }

  @action
  setScore(event: any) {
    this.score = event.target.value;
  }

  // Returns safe HTML for use in sentences via triple-curlies {{{this.scoreEmoji}}}
  get scoreEmoji() {
    return this.emoji.htmlFor(this.args.entry.shrimpoEmoji);
  }

  // Returns the raw URL string for img src attributes
  get scoreEmojiPath() {
    return this.emoji.urlFor(this.args.entry.shrimpoEmoji);
  }
}