import Route from '@ember/routing/route';
// FIXME this causes an error when rendering the link to route
// maybe it's fixed in a newer ember version??
// import { service } from '@ember/service';
// import type StoreService from '@ember-data/store';

export default class HomeWiki extends Route {
  // @service declare store: StoreService;
  model() {
    return this.store.findAll('wikiPage');
  }
}
