import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserCustomEmojisRoute extends Route {
  @service session;
  @service currentUser;
  @service store;
  @service router;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.login');
    await this.currentUser.load();
  }

  afterModel() {
    if (!this.currentUser.user || this.currentUser.user.level < 3) {
      this.router.transitionTo('home.index');
    }
  }

  model() {
    return this.store.findAll('custom-emoji');
  }
}
