import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategory from 'datafruits13/models/shrimpo-voting-category';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

interface ShrimpoVotingCategoriesTableArgs {
  entry: ShrimpoEntry;
  votingCategories: [ShrimpoVotingCategory];
  votingCompletionPercentage: number;
}

export default class ShrimpoVotingCategoriesTable extends Component<ShrimpoVotingCategoriesTableArgs> {
  @service
  declare session: any;

  @service
  declare store: any;

  @service
  declare currentUser: any;

  @tracked votes: any = {};

  @tracked voted: boolean = false;

  shrimpVoteUrl = `${ENV.API_HOST}/api/shrimpos/${this.args.entry.shrimpoSlug}/shrimpo_entries/${this.args.entry.slug}/voting_categories.json`;

  constructor(owner: unknown, args: any) {
    super(owner, args);

    const existingVotes = this.args.entry.shrimpoVotes.filter((vote: any) => {
      return vote.get('user.id') == this.currentUser.user.id;
    });
    if(existingVotes.length === 5) {
      this.voted = true;
      // populate existing votes
      this.args.entry.shrimpoVotes.forEach((vote: any)  => {
        this.votes[vote.votingCategoryName] = {score: vote.score, emoji: vote.votingCategoryEmoji};
      });
    } else {
      // initialize votes if no existing votes
      this.args.votingCategories.forEach((votingCategory: ShrimpoVotingCategory) => {
        this.votes[votingCategory.name] = {score: 1, emoji: votingCategory.emoji};
      });
    }

  }

  @action
  setScore(name: string, event: any) {
    this.votes[name].score = event.target.value;
    this.votes = { ...this.votes };
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
          this.voted = true;
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
