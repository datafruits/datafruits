import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeUserMyShows extends Route {
  @service declare store: any;
  model() {
    return this.store.query('scheduled-show', { my: true });
  }
}
