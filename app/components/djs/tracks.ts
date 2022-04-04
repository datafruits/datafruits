import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';

interface DjsTracksArgs {
  page: string;
  dj: void;
}

export default class DjsTracks extends Component<DjsTracksArgs> {
  @service declare store: Store;
  @service declare router: RouterService;

  @action
  async fetchTracks() {
    // @ts-expect-error
    return this.store.query('track', { dj: this.args.dj.id, page: this.args.page });
  }
}
