import Model, { attr, hasMany, belongsTo, type SyncHasMany } from '@ember-data/model';
import type ShrimpoEntry from './shrimpo-entry';
import type User from './user';

export default class Shrimpo extends Model {
  @belongsTo('user') declare user: User;
  @hasMany('shrimpo-entry', { async: false }) declare shrimpoEntries: SyncHasMany<ShrimpoEntry>;
  @attr('string') declare title: string;
  @attr('string', { defaultValue: (new Date()).toISOString()}) declare startAt: string;
  @attr('string') declare endAt: string;

  @attr('string', { defaultValue: '2 hours' }) declare duration: string;

  @attr('string') declare rulePack: string;

  @attr('string') declare zipFileUrl: string;

  @attr('string') declare zipFile: string;

  @attr('string') declare coverArt: string;
  @attr('string') declare coverArtUrl: string;

  @attr('string') declare status: 'running' | 'voting' | 'completed';
  @attr('string') declare slug: string;

  @attr('string') declare emoji: string;

  @attr('date') declare endedAt: string;

  get savedShrimpoEntries() {
    return this.shrimpoEntries.filter(entry => {
      return !entry.isNew;
    });
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo': Shrimpo;
  }
}
