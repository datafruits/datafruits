import Route from '@ember/routing/route';
import { service } from "@ember/service";

export default class HomeForumShow extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('forum-thread', params.title);
  }
}
