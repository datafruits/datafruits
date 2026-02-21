import { Model, attr } from '../../framework/index.js';

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
