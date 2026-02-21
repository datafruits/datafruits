import { Model, attr, hasMany } from '../../../framework/index.js';

export default class Podcast extends Model {
  @attr title;

  @attr meta;

  @hasMany('track', {
    async: false,
    inverse: 'podcast'
  }) tracks;
}
