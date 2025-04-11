import Model, { attr } from '@ember-data/model';

export default class HostApplication extends Model {
  @attr()
  username;

  @attr()
  email;

  @attr()
  link;

  @attr()
  interval;

  @attr()
  desiredTime;

  @attr()
  otherComment;

  @attr()
  timeZone;

  @attr()
  homepageUrl;
}
