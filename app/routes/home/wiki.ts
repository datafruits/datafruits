import Route from '@ember/routing/route';

export default class HomeWiki extends Route {
  // normal class body definition here
  model() {
    return this.store.findAll('wikiPage');
  }
}
