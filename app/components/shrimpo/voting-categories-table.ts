import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategory from 'datafruits13/models/shrimpo-voting-category';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';

interface ShrimpoVotingCategoriesTableArgs {
  entry: ShrimpoEntry;
  votingCategories: [ShrimpoVotingCategory];
  votingCompletionPercentage: number;
}

interface VoteState {
  score: number;
  emoji: string;
}

export default class ShrimpoVotingCategoriesTable extends Component<ShrimpoVotingCategoriesTableArgs> {
  @service
  declare session: any;

  @service
  declare store: any;

  @service
  declare currentUser: any;

  @tracked editedVotes: Record<string, VoteState> | null = null;

  @tracked hasSavedVote = false;

  get shrimpVoteUrl() {
    return `${ENV.API_HOST}/api/shrimpos/${this.args.entry.shrimpoSlug}/shrimpo_entries/${this.args.entry.slug}/voting_categories.json`;
  }

  get existingVotes() {
    const currentUserId = this.currentUser.user?.id;

    if (!currentUserId) {
      return [];
    }

    return this.args.entry.shrimpoVotes.filter((vote: any) => {
      return vote.get('user.id') == currentUserId;
    });
  }

  get initialVotes(): Record<string, VoteState> {
    const votes: Record<string, VoteState> = {};

    if (this.existingVotes.length === this.args.votingCategories.length) {
      this.existingVotes.forEach((vote: any) => {
        votes[vote.votingCategoryName] = {
          score: vote.score,
          emoji: vote.votingCategoryEmoji
        };
      });
    } else {
      this.args.votingCategories.forEach((votingCategory: ShrimpoVotingCategory) => {
        votes[votingCategory.name] = {
          score: 1,
          emoji: votingCategory.emoji
        };
      });
    }

    return votes;
  }

  get votes(): Record<string, VoteState> {
    return this.editedVotes ?? this.initialVotes;
  }

  get voted(): boolean {
    return this.hasSavedVote || this.existingVotes.length === this.args.votingCategories.length;
  }

  @action
  setScore(name: string, event: any) {
    if (!this.editedVotes) {
      this.editedVotes = { ...this.initialVotes };
    }

    this.editedVotes[name] = {
      ...this.editedVotes[name],
      score: Number(event.target.value)
    };
    this.editedVotes = { ...this.editedVotes };
  }

  @action
  saveVote() {
    const shrimpVotesData = Object.entries(this.votes).map((vote) => {
      const attrs: any = vote[1];
      return {
        attributes: {
          category_name: vote[0],
          score: attrs.score as number
        },
        type: "shrimpo_votes"
      };
    });
    const data = {
      data: shrimpVotesData,
      shrimpo_entry_id: this.args.entry.slug
    };

    fetch(this.shrimpVoteUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.session.data.authenticated.token}`
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        if (data.status == 200) {
          alert('Voteded!');
          this.hasSavedVote = true;
          this.store.findRecord('shrimpo', this.args.entry.shrimpoSlug);
        } else {
          alert('Something went wrong!');
        }
      })
      .catch((error) => {
        alert('Something went wrong!');
        console.log(error);
      });
  }
}
