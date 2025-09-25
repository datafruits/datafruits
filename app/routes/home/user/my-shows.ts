import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticatedRouteMixin from 'datafruits13/mixins/authenticated-route';

export default class HomeUserMyShows extends Route.extend(AuthenticatedRouteMixin) {
  @service declare store: any;
  model() {
    return this.store.query('show-series', { my: true });
  }
}
