import Model, { attr } from '@ember-data/model';

export default class FruitSummon extends Model {
  @attr('string') declare name: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'fruit-summon': FruitSummon;
//   }
// }
