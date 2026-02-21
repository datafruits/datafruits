import { attr, hasMany } from '../../../framework/index.js';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import User from './user.js';

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

  @hasMany('link', {
    async: false,
    inverse: null
  })
  links;

  @hasMany('track', {
    async: false,
    inverse: 'dj'
  })
  tracks;

  @attr()
  role;

  @hasMany('scheduled-show', {
    async: false,
    inverse: null
  })
  scheduledShows;

  get nextShow() {
    return this.scheduledShows
      .filter((scheduledShow) => {
        return dayjs(scheduledShow.start).isSameOrAfter(Date.now());
      })
      .get('firstObject');
  }

  get roles() {
    return this.roles.split(" ");
  }
}
