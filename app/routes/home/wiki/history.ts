import Route from '@ember/routing/route';

export default class HomeWikiHistory extends Route.extend({
  // anything which *must* be merged to prototype here
}) {
  // normal class body definition here
  model(params: any) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
