import { attr, hasMany } from '@ember-data/model';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import User from 'datafruits13/models/user';

dayjs.extend(isSameOrAfter);

export default class Dj extends User {
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

  @attr()
  createdAt;

  @attr()
  lastSignInAt;

  @hasMany('link')
  links;

  @hasMany('track')
  tracks;

  @attr()
  role;

  @hasMany('scheduled-show')
  scheduledShows;

  get nextShow() {
    return this.scheduledShows
      .filter((scheduledShow) => {
        return dayjs(scheduledShow.start).isSameOrAfter(Date.now());
      })
      .get('firstObject');
  }

  get roles() {
    return this.roles.split(" ")
  }
}
