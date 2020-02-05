import Model, { belongsTo, attr } from '@ember-data/model';

export default Model.extend({
  dj: belongsTo('dj'),
  url: attr()
});
