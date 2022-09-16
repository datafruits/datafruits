import Route from '@ember/routing/route';

export default class HomeWikiShow extends Route {
  model(params: any) {
    return this.store.findRecord('wikiPage', params.title);
  }
}
