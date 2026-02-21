import { Model, attr, belongsTo } from '../../../framework/index.js';
import type ShrimpoEntry from './shrimpo-entry';
import type shrimpoVotingCategory from './shrimpo-voting-category';
import type User from './user';

export default class ShrimpoVote extends Model {
  @belongsTo('user', {
    async: true,
    inverse: null
  }) declare user: User;
  @belongsTo('shrimpo-entry', {
    async: false,
    inverse: null
  }) declare shrimpoEntry: ShrimpoEntry;
  @belongsTo('shrimpo-voting-category', {
    async: false,
    inverse: null
  }) declare shrimpoVotingCategory: shrimpoVotingCategory;

  @attr('number') declare score: number;
  @attr('string') declare votingCategoryName: string;
  @attr('string') declare votingCategoryEmoji: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.}
