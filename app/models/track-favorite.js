import Model, { belongsTo, attr } from '@ember-data/model';

export default class TrackFavorite extends Model {
  @belongsTo('user') user;
  @belongsTo('track') track;

  @attr() trackId;
}
