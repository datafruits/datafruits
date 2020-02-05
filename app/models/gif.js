import Model, { attr } from '@ember-data/model';

export default Model.extend({
  slug: attr(),
  url: attr(),
  previewUrl: attr()
});
