import Model, { belongsTo, attr } from '@ember-data/model';

export default class Link extends Model {
  @belongsTo('dj')
  dj;

  @attr()
  url;
}
