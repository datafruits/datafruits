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
}

export default class ShrimpoVotingCategoriesTable extends Component<ShrimpoVotingCategoriesTableArgs> {
  @service
  declare session: any;

  @service
  declare store: any;

  @service
  declare currentUser: any;

  @tracked votes: any = {};

  shrimpVoteUrl = `${ENV.API_HOST}/api/shrimpos/${this.args.entry.shrimpoSlug}/shrimpo_entries/${this.args.entry.slug}/voting_categories.json`;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.args.votingCategories.forEach((votingCategory: ShrimpoVotingCategory) => {
      // TODO how to populate existing votes????
      console.log(votingCategory);
      this.votes[votingCategory.name] = {score: 0, emoji: votingCategory.emoji};
    });
  }

  @action
  setScore(name: string, event: any) {
    this.votes[name].score = event.target.value;
  }

  @action
  async saveVote() {
    const shrimpVotesData = Object.entries(this.votes).map((vote) => {
      const attrs: any = vote[1];
      return {
        attributes: {
          category_name: vote[0] as string,
          score: attrs.score as number
        },
        type: "shrimpo_votes"
      };
    });
    // save all votes one by one ? or new API ? or new model ???
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
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(() => {
        alert('Something went wrong!');
      });
  }
}
