import Model, { attr, belongsTo } from '@ember-data/model';
import type ShrimpoEntry from './shrimpo-entry';
import type User from './user';

export default class ShrimpoVote extends Model {
  @belongsTo('user') declare user: User;
  @belongsTo('shrimpo-entry') declare shrimpoEntry: ShrimpoEntry;

  @attr('number') declare score: number;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-vote': ShrimpoVote;
  }
}
