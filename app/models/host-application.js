import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
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
