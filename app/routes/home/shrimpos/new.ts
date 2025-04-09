import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type StoreService from '@ember-data/store';

export default class HomeShrimposNew extends Route {
  @service declare store: StoreService;
  model() {
    return this.store.createRecord('shrimpo');
  }
}
