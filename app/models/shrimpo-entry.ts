import Model, { attr, belongsTo } from '@ember-data/model';
import type Shrimpo from './shrimpo';
import type User from './user';

export default class ShrimpoEntry extends Model {
  @belongsTo('user') declare user: User;
  @belongsTo('shrimpo') declare shrimpo: Shrimpo;

  @attr('string') declare username: string;
  @attr('string') declare userAvatar: string;
  @attr('string') declare userRole: string;
  @attr('string') declare title: string;
  @attr('string') declare description: string;
  @attr('string') declare slug: string;

  @attr('string') declare audio: string;
  @attr('string') declare cdnUrl: string;

  @attr('string') declare shrimpoEmoji: string;
  @attr('string') declare shrimpoSlug: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-entry': ShrimpoEntry;
  }
}