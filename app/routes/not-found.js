import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class NotFoundRoute extends Route {
  @service('router') router;
redirect() {
    this.router.transitionTo('/not-found');
  }
}
