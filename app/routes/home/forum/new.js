import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeForumNew extends Route {
  @service session;
  @service store;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'home.chat');
  }

  model() {
    return this.store.createRecord('forum-thread');
  }
}
