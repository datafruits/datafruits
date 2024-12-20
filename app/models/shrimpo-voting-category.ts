import Model, { attr, belongsTo, hasMany, type SyncHasMany } from '@ember-data/model';
import type Shrimpo from './shrimpo';
import type shrimpoVotingCategoryScore from './shrimpo-voting-category-score';

export default class ShrimpoVotingCategory extends Model {
  @belongsTo('shrimpo') declare shrimpo: Shrimpo;
  @hasMany('shrimpo-voting-category-score') declare shrimpoVotingCategoryScores: SyncHasMany<shrimpoVotingCategoryScore>;

  @attr('string') declare name: string;
  @attr('string') declare emoji: string;

  get sortedScores() {
    return this.shrimpoVotingCategoryScores.sortBy('ranking');
  }
}
