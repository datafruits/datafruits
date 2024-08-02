import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserSettingsRoute extends Route {
  @service store;
  @service session;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.chat');
  }
}
