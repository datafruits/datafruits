import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import type ShrimpoEntry from './shrimpo-entry';
import type User from './user';

export default class Shrimpo extends Model {
  @belongsTo('user') declare user: User;
  @hasMany('shrimpo-entry') declare shrimpoEntries: ShrimpoEntry;
  @attr('string') declare title: string;
  @attr('string') declare startAt: string;
  @attr('string') declare endAt: string;
  
  @attr('string') declare rulePack: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo': Shrimpo;
  }
}
