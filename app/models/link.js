import classic from 'ember-classic-decorator';
import Model, { belongsTo, attr } from '@ember-data/model';

@classic
export default class Link extends Model {
  @belongsTo('dj')
  dj;

  @attr()
  url;
}
