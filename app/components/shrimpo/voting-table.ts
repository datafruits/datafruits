import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

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

  @service('emoji-zone')
  declare emojiZone: EmojiZoneService;

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

  get scoreEmojiPath() {
    // Resolve directly through the EmojiZoneService manifest mapping
    return this.emojiZone.urlFor(this.args.entry.shrimpoEmoji);
  }
}