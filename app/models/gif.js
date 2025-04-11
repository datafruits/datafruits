import Model, { attr } from '@ember-data/model';

export default class Gif extends Model {
  @attr()
  slug;

  @attr()
  url;

  @attr()
  previewUrl;
}
