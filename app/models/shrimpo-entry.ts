import Model, { attr, belongsTo, hasMany, type SyncHasMany } from '@ember-data/model';
import type Shrimpo from './shrimpo';
import type ShrimpoVote from './shrimpo-vote';
import type Post from './post';
import type User from './user';
import type TrophyAward from './trophy-award';

export default class ShrimpoEntry extends Model {
  @belongsTo('user') declare user: User;
  @belongsTo('shrimpo') declare shrimpo: Shrimpo;
  @hasMany('shrimpo-vote', { async: false }) declare shrimpoVotes: SyncHasMany<ShrimpoVote>;
  @hasMany('posts', { async: false }) declare posts: SyncHasMany<Post>;
  @hasMany('trophy-award', { async: false }) declare trophyAwards: SyncHasMany<TrophyAward>;

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

  @attr('date') declare createdAt: string;

  @attr('string') declare nextShrimpoEntrySlug: string;
  @attr('string') declare previousShrimpoEntrySlug: string;

  @attr('string') declare ranking: string;
  @attr('string') declare totalScore: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-entry': ShrimpoEntry;
  }
}
