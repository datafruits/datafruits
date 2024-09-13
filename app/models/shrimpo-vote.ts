import Model, { attr, belongsTo } from '@ember-data/model';
import type ShrimpoEntry from './shrimpo-entry';
import type shrimpoVotingCategory from './shrimpo-voting-category';
import type User from './user';

export default class ShrimpoVote extends Model {
  @belongsTo('user') declare user: User;
  @belongsTo('shrimpo-entry') declare shrimpoEntry: ShrimpoEntry;
  @belongsTo('shrimpo-voting-category') declare shrimpoVotingCategory: shrimpoVotingCategory;

  @attr('number') declare score: number;
  @attr('string') declare votingCategoryName: string;
  @attr('string') declare votingCategoryEmoji: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-vote': ShrimpoVote;
  }
}
