import Model, { belongsTo, attr } from '@ember-data/model';

export default class PodcastFavorite extends Model {
  @belongsTo('user', {
    async: false,
    inverse: null
  }) user;
  @belongsTo('podcast', {
    async: false,
    inverse: null
  }) podcast;

  @attr() podcastId;
  @attr() userId;
}