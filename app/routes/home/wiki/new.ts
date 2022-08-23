import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class HomeWikiNew extends Route {
  // normal class body definition here
  @service declare session: Session;

  beforeModel(transition: any) {
    alert('sorry pal ya gotta log in before you can add wikis');
    this.session.requireAuthentication(transition, 'home.chat');
  }
  model() {
    return this.store.createRecord('wiki-page');
  }
}
