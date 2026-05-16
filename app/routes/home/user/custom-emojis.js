import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserCustomEmojisRoute extends Route {
  @service session;
  @service currentUser;
  @service router;

  async beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.login');
    await this.currentUser.load(true);
  }

  afterModel() {
    const user = this.currentUser.user;

    if (!user || user.level < 3 || !user.roles.includes('dj')) {
      this.router.transitionTo('home.index');
    }
  }

  model() {
    return this.currentUser.user?.get('customEmojis') ?? [];
  }
}
