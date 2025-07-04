import Model, { attr } from '@ember-data/model';

export default class Label extends Model {
  @attr()
  name;
}
