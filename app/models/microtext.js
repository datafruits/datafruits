import Model, { attr, belongsTo } from '@ember-data/model';

export default class Microtext extends Model {
  @attr
  content;

  @attr
  username;
}
