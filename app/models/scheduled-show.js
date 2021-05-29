import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
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

  @hasMany('dj')
  djs;

  @computed('djs')
  get host() {
    return this.djs.get('firstObject');
  }

  @attr()
  htmlDescription;

  @attr()
  tweetContent;

  @alias('start')
  startsAt;

  @alias('end')
  endsAt;

  @attr()
  isGuest;

  @attr()
  guest;
}
