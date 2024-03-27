import Model, { attr, belongsTo } from '@ember-data/model';
import type ShrimpoEntry from './shrimpo-entry';

export default class TrophyAward extends Model {
  @belongsTo('shrimpo-entry') declare shrimpoEntry: ShrimpoEntry;

  @attr('string') declare name: string;
  @attr('string') declare imageUrl: string;
  @attr('string') declare modelUrl: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'trophy-award': TrophyAward;
  }
}
