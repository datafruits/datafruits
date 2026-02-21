import { Model, attr } from '../../framework/index.js';

export default class Gif extends Model {
  @attr()
  slug;

  @attr()
  url;

  @attr()
  previewUrl;
}
