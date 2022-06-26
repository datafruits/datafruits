import Route from '@ember/routing/route';

export default class HomeWikiNew extends Route {
  // normal class body definition here
  model() {
    return this.store.createRecord('wiki-page');
  }
}
