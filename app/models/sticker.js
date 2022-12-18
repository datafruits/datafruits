import classic from 'ember-classic-decorator';
import Model, { attr } from '@ember-data/model';

@classic
export default class Sticker extends Model {
  @attr()
  slug;

  @attr()
  url;

  @attr()
  previewUrl;
}
