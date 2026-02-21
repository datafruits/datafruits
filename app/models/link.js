import { Model, belongsTo, attr } from '../../framework/index.js';

export default class Link extends Model {
  @belongsTo('dj', {
    async: false,
    inverse: null
  })
  dj;

  @attr()
  url;
}
