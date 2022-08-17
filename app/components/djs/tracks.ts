import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
// import fetch from 'fetch';
// import ENV from 'datafruits13/config/environment';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';

interface DjsTracksArgs {
  page: string;
  dj: void;
}

export default class DjsTracks extends Component<DjsTracksArgs> {
  @service declare store: Store;
  @service declare router: RouterService;

  // get djTracksUrl(): string {
  //   // @ts-expect-error
  //   return `${ENV.API_HOST}/api/djs/${this.args.dj.id}/tracks?page=${this.args.page}`;
  // }

  @action
  async fetchTracks() {
    // let response = await fetch(this.djTracksUrl);
    // return response.json();
    // @ts-expect-error
    return this.store.query('track', { dj: this.args.dj.id, page: this.args.page });
  }
}
