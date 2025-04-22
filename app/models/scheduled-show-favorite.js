import Model, { belongsTo, attr } from '@ember-data/model';

export default class ScheduledShowFavorite extends Model {
  @belongsTo('user', {
    async: false,
    inverse: null
  }) user;
  @belongsTo('scheduled-show', {
    async: false,
    inverse: null
  }) scheduledShow;

  @attr() scheduledShowId;
  @attr() userId;
}
