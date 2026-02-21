import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import type { Store } from '../../../framework/index.js';

interface DjsListArgs {
  searchParams: any;
}

export default class DjsList extends Component<DjsListArgs> {
  @service declare router: RouterService;
  @service declare store: Store;

  get fetchDjs() {
    const query = {
      page: this.args.searchParams.page,
      search: { keyword: this.args.searchParams.query },
      tags: this.args.searchParams.tags,
    };
    const djsPromise = this.store.query('user', query);
    return djsPromise;
  }
}
