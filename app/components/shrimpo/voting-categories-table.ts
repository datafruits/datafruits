import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategory from 'datafruits13/models/shrimpo-voting-category';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

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

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.args.votingCategories.forEach((votingCategory: ShrimpoVotingCategory) => {
      this.votes[votingCategory.name] = {score: 0, emoji: votingCategory.emoji};
    });
  }

  @action
  setScore(event: any, name: any) {
    this.votes[name].score = event.target.value;
  }

  @action
  async saveVote() {
    // save all votes one by one ? or new API ? or new model ???
  }
}
