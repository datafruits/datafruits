import Route from '@ember/routing/route';

export default class HomeWikiHistory extends Route {
  // normal class body definition here
  model(params: any) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
