import { Model, belongsTo, attr } from '../../../framework/index.js';

export default class TrackFavorite extends Model {
  @belongsTo('user', {
    async: false,
    inverse: null
  }) user;
  @belongsTo('track', {
    async: false,
    inverse: null
  }) track;

  @attr() trackId;
  @attr() userId;
}
