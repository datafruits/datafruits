import Component from '@glimmer/component';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
//import type ShrimpoVote from 'datafruits13/models/shrimpo-vote';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import { emojiPath } from 'datafruits13/helpers/emoji-path';
import { inject as service } from '@ember/service';

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

  @tracked editedScore: number | null = null;

  @tracked hasSavedVote = false;

  //vote: ShrimpoVote;

  get existingVote() {
    const currentUserId = this.currentUser.user?.id;

    if (!currentUserId) {
      return undefined;
    }

    return this.args.entry.shrimpoVotes.find((vote: any) => {
      return vote.get('user.id') == currentUserId;
    });
  }

  get score(): number {
    return this.editedScore ?? this.existingVote?.score ?? 1;
  }

  get voted(): boolean {
    return this.hasSavedVote || Boolean(this.existingVote);
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
      this.hasSavedVote = true;
    } catch (error) {
      console.log(vote);
      console.log(error);
      console.trace();
      alert('couldnt save vote!');
    }
  }

  @action
  setScore(event: any) {
    this.editedScore = Number(event.target.value);
  }

  get scoreEmoji() {
    return formatEmojiHtml(this.args.entry.shrimpoEmoji);
  }

  get scoreEmojiPath() {
    return emojiPath([this.args.entry.shrimpoEmoji]);
  }
}
