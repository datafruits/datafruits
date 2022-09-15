import classic from 'ember-classic-decorator';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class ScheduledShow extends Model {
  @attr()
  start;

  @attr()
  end;

  @attr()
  title;

  @attr()
  imageUrl;

  @attr()
  thumbImageUrl;

  @attr()
  description;

  @attr()
  hostedBy;

  @hasMany('track')
  tracks;

  @hasMany('user') // TODO merge the user and dj models together
  djs;

  get host() {
    return this.djs.get('firstObject');
  }

  @attr()
  htmlDescription;

  @attr()
  tweetContent;

  @attr()
  isGuest;

  @attr()
  guest;

  @attr()
  slug;
}
