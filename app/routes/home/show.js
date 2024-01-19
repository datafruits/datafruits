import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { metaToHeadTags } from 'ember-cli-meta-tags';
import { inject as service } from '@ember/service';

export default class ShowRoute extends Route {
  @service headData;

  model(params) {
    return this.store.findRecord('show-series', params.slug);
  }

  afterModel(model) {
    this.headData.title = `datafruits.fm - ${model.title}`;
    this.headData.description = model.description;
    this.headData.image = model.imageUrl;
  }
}
