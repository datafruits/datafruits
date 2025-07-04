import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class HomeShowsEpisode extends Route {
  @service declare store: any;
  @service declare headData: any;

  model(params: any) {
    return this.store.findRecord('scheduled-show', params.slug, {
      adapterOptions: {
        show_series_id: params.showSeriesSlug, // :shrug:
      },
    });
  }

  afterModel(model: any) {
    this.headData.title = `datafruits.fm - ${model.title}`;
    this.headData.description = model.description;
    this.headData.image = model.imageUrl;
  }
}
