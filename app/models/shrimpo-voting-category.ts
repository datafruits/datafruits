import Model, { attr, belongsTo } from '@ember-data/model';
import type Shrimpo from './shrimpo';

export default class ShrimpoVotingCategory extends Model {
  @belongsTo('shrimpo') declare shrimpo: Shrimpo;

  @attr('string') declare name: string;
  @attr('string') declare emoji: string;
}
