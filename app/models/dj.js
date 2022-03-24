import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, hasMany } from '@ember-data/model';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrAfter);

@classic
export default class Dj extends Model {
  @attr()
  username;

  @attr()
  imageUrl;

  @attr()
  imageThumbUrl;

  @attr()
  imageMediumUrl;

  @attr()
  bio;

  @attr()
  style;

  @attr()
  pronouns;

  @hasMany('link')
  links;

  @hasMany('track')
  tracks;

  @hasMany('scheduled-show')
  scheduledShows;

  @computed('scheduledShows')
  get nextShow() {
    return this.scheduledShows
      .filter((scheduledShow) => {
        return dayjs(scheduledShow.start).isSameOrAfter(Date.now());
      })
      .get('firstObject');
  }
}
