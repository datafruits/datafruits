import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type { Store } from '../../../framework/index.js';
import RouterService from '@ember/routing/router-service';
import Dj from 'datafruits13/models/dj';

interface DjsTracksSignature {
  Args: {
    page: string;
    dj: Dj;
  };
}

export default class DjsTracks extends Component<DjsTracksSignature> {
  @service declare store: Store;
  @service declare router: RouterService;

  get fetchTracks() {
    return this.store.query('scheduled-show', { dj: this.args.dj.id, page: this.args.page });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DjsTracks: typeof DjsTracks;
  }
}
