import Model, { attr, hasMany } from '@ember-data/model';

export default class Podcast extends Model {
  @attr title;

  @attr meta;

  @hasMany('track') tracks;
}
