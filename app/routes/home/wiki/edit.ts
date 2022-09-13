import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class HomeWikiEdit extends Route.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  @service declare session: Session;

  beforeModel(transition: any) {
    this.session.requireAuthentication(transition, 'home.chat');
  }

  model(params: any) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
