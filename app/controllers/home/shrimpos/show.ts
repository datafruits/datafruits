import Controller from '@ember/controller';
import type Shrimpo from 'datafruits13/models/shrimpo';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type ShrimpoVotingCategory from 'datafruits13/models/shrimpo-voting-category';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

export default class HomeShrimposShow extends Controller {
  @service declare currentUser: any;
  @service declare session: any;

  @tracked endShrimpoSubmitted: boolean = false;

  declare model: {
    shrimpo: Shrimpo,
    shrimpoEntry: ShrimpoEntry
  };

  get canShowEntries() {
    return this.model.shrimpo.status === 'voting' || this.model.shrimpo.status === 'completed' || this.model.shrimpo.shrimpoType === 'mega';
  }

  get formattedVotingCategories() {
    return this.model.shrimpo.shrimpoVotingCategories.map((votingCategory: ShrimpoVotingCategory) => {
      return `${votingCategory.name}`;
    }).join(" •︎ ");
  }

  get canEndShrimpo(): boolean {
    return this.model.shrimpo.status === 'voting';
  }

  get hostLoggedIn() {
    return this.session.isAuthenticated && (this.currentUser.user === this.model.shrimpo.user || this.currentUser.user.role.includes("admin"));
  }

  @action
  endShrimpo() {
    const endShrimpoUrl = `${ENV.API_HOST}/api/shrimpos/${this.model.shrimpo.slug}/end_shrimpos.json`;

    const result = confirm(`Are you sure you everyone has voting and you want to end the shrimpo?`);
    if (result) {
      fetch(endShrimpoUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then((data) => {
        if (data.status == 200) {
          alert('Shrimpo ended!');
          this.endShrimpoSubmitted = true;
        } else {
          alert('Something went wrong!');
        }
      })
      .catch(() => {
        alert('Something went wrong!');
      });
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'home/shrimpos/show': HomeShrimposShow;
  }
}
