import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Model, { attr, hasMany } from '@ember-data/model';
import moment from 'moment';

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

  @hasMany('link')
  links;

  @hasMany('track')
  tracks;

  @hasMany('scheduled-show')
  scheduledShows;

  @computed('scheduledShows')
  get nextShow() {
    return this.scheduledShows.filter((scheduledShow) => {
      return moment(scheduledShow.start).isSameOrAfter(Date.now());
    }).get('firstObject');
  }
}
