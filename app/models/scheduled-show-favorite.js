import Model, { belongsTo, attr } from '@ember-data/model';

export default class ScheduledShowFavorite extends Model {
  @belongsTo('user') user;
  @belongsTo('scheduled-show') scheduledShow;

  @attr() scheduledShowId;
  @attr() userId;
}
