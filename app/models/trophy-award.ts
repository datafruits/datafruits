import { Model, attr, belongsTo } from '../../framework/index.js';
import type ShrimpoEntry from './shrimpo-entry';

export default class TrophyAward extends Model {
  @belongsTo('shrimpo-entry', {
    async: false,
    inverse: null
  }) declare shrimpoEntry: ShrimpoEntry;

  @attr('string') declare name: string;
  @attr('string') declare imageUrl: string;
  @attr('string') declare modelUrl: string;

  get url() {
    return this.imageUrl;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.}
