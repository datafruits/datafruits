import Model, { attr } from '@ember-data/model';

export default class Sticker extends Model {
  @attr()
  slug;

  @attr()
  url;

  @attr()
  previewUrl;
}
