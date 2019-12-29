import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  slug: DS.attr(),
  url: DS.attr(),
  previewUrl: DS.attr()
});
