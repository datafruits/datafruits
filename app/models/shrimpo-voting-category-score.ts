import Model, { attr, belongsTo } from '@ember-data/model';
import type ShrimpoVotingCategory from './shrimpo-voting-category';
import type ShrimpoEntry from './shrimpo-entry';

export default class ShrimpoVotingCategoryScore extends Model {
  @belongsTo('shrimpo-voting-category', {
    async: false,
    inverse: null
  }) declare shrimpoVotingCategory: ShrimpoVotingCategory;
  @belongsTo('shrimpo-entry', {
    async: false,
    inverse: 'shrimpoVotingCategoryScores'
  }) declare shrimpoEntry: ShrimpoEntry;

  @attr('number') declare score: number;
  @attr('number') declare ranking: number;

}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-voting-category-score': ShrimpoVotingCategoryScore;
  };;;;;;;;;;
}
