import Route from '@ember/routing/route';

export default class ShrimposEntriesShow extends Route {
  async model(params: any) {
    return this.store.findRecord('shrimpo-entry', params.slug, {
      adapterOptions: {
        shrimpo_id: params.shrimpo_slug, // :shrug:
      },
    });
  }
}
