import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeWikiNew extends Route {
  @service session;
  @service store;
  @service redirectAfterLogin;

  beforeModel(transition) {
    if (!this.session.isAuthenticated) {
      this.redirectAfterLogin.storeIntendedRoute(transition);
    }
    this.session.requireAuthentication(transition, 'home.chat');
  }
  model() {
    return this.store.createRecord('wiki-page');
  }
}
