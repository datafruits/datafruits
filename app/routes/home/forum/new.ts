import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Session from 'ember-simple-auth/services/session';

export default class HomeForumNew extends Route {
  @service declare session: Session;

  beforeModel(transition: any) {
    this.session.requireAuthentication(transition, 'home.chat');
  }

  model() {
    return this.store.createRecord('forum-thread');
  }
}
