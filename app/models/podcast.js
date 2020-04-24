import classic from 'ember-classic-decorator';
import Model, { attr, hasMany } from '@ember-data/model';

@classic
export default class Podcast extends Model {
  @attr()
  title;

  @attr()
  url;

  @attr()
  meta;

  @hasMany('track')
  tracks;
}
