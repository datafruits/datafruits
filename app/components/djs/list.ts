import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';

interface DjsListArgs {
  searchParams: any;
}

export default class DjsList extends Component<DjsListArgs> {
  @service declare router: RouterService;
  @service declare store: Store;

  @action
  fetchDjs() {
    const query = {
      page: this.args.searchParams.page,
      search: { keyword: this.args.searchParams.query },
    };
    const djsPromise = this.store.query('dj', query);
    return djsPromise;
  }
}
