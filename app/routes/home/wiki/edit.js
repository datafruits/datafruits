import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeWikiEdit extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.chat');
  }

  model(params) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
