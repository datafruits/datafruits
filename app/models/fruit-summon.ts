import Model, { attr, belongsTo } from '@ember-data/model';
import type User from './user';

export default class FruitSummon extends Model {
  @attr('string') declare name: string;
  @belongsTo('user', { async: true }) declare user: User;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'fruit-summon': FruitSummon;
//   }
// }
