import { Model, attr } from '../../framework/index.js';

export default class Sticker extends Model {
  @attr()
  slug;

  @attr()
  url;

  @attr()
  previewUrl;
}
