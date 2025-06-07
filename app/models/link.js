import Model, { belongsTo, attr } from '@ember-data/model';

export default class Link extends Model {
  @belongsTo('dj', {
    async: false,
    inverse: null
  })
  dj;

  @attr()
  url;
}
