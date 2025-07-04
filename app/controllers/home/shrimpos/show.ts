import Controller from '@ember/controller';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import fetch from 'fetch';

export default class HomeShrimposShow extends Controller {
  @service declare currentUser: any;
  @service declare session: any;

  @tracked endShrimpoSubmitted: boolean = false;

  declare model: Shrimpo;

  get canShowEntries() {
    return this.model.status === 'voting' || this.model.status === 'completed' || this.model.shrimpoType === 'mega';
  }

  get formattedVotingCategories() {
    return this.model.shrimpoVotingCategories.map((votingCategory) => {
      return `${votingCategory.name}`;
    }).join(" •︎ ");
  }

  get canEndShrimpo(): boolean {
    return this.model.status === 'voting';
  }

  get hostLoggedIn() {
    return this.session.isAuthenticated && (this.currentUser.user === this.model.user || this.currentUser.user.role.includes("admin"));
  }

  @action
  endShrimpo() {
    const endShrimpoUrl = `${ENV.API_HOST}/api/shrimpos/${this.model.slug}/end_shrimpos.json`;

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
