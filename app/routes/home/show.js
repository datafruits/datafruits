import Route from '@ember/routing/route';
import ENV from 'datafruits13/config/environment';
import { metaToHeadTags } from 'ember-cli-meta-tags';
import { service } from '@ember/service';

export default class ShowRoute extends Route {
  @service headData;
  @service store;

  model(params) {
    return this.store.findRecord('show-series', params.slug);
  }

  afterModel(model) {
    this.headData.title = `datafruits.fm - ${model.title}`;
    this.headData.description = model.description;
    // Use thumbImageUrl for social media embeds as it's more reliable and appropriately sized
    // Fall back to imageUrl if thumbImageUrl is not available
    this.headData.image = model.thumbImageUrl || model.imageUrl;
  }
}
