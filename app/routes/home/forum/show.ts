import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';

export default class HomeForumShow extends Route {
  @service declare store: StoreService;

  model(params: any) {
    return this.store.findRecord('forum-thread', params.title);
  }
}
