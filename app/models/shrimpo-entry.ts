import Model, { attr, belongsTo, hasMany, type SyncHasMany } from '@ember-data/model';
import type Shrimpo from './shrimpo';
import type ShrimpoVote from './shrimpo-vote';
import type ShrimpoVotingCategoryScore from './shrimpo-voting-category-score';
import type ShrimpoVotingCategory from './shrimpo-voting-category';
import type Post from './post';
import type User from './user';
import type TrophyAward from './trophy-award';

export default class ShrimpoEntry extends Model {
  @belongsTo('user', {
    async: false,
    inverse: 'shrimpoEntries'
  }) declare user: User;
  @belongsTo('shrimpo', {
    async: true,
    inverse: 'shrimpoEntries'
  }) declare shrimpo: Shrimpo;
  @hasMany('shrimpo-vote', {
    async: false,
    inverse: null
  }) declare shrimpoVotes: SyncHasMany<ShrimpoVote>;
  @hasMany('shrimpo-voting-category-score', {
    async: false,
    inverse: 'shrimpoEntry'
  }) declare shrimpoVotingCategoryScores: SyncHasMany<ShrimpoVotingCategoryScore>;
  @hasMany('shrimpo-voting-category', {
    async: false,
    inverse: null
  }) declare shrimpoVotingCategories: SyncHasMany<ShrimpoVotingCategory>;
  @hasMany('posts', {
    async: false,
    inverse: null
  }) declare posts: SyncHasMany<Post>;
  @hasMany('trophy-award', {
    async: false,
    inverse: null
  }) declare trophyAwards: SyncHasMany<TrophyAward>;

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
  @attr('string') declare shrimpoTitle: string;
  @attr('string') declare shrimpoTotalEntries: string;

  @attr('date') declare createdAt: string;

  @attr('string') declare nextShrimpoEntrySlug: string;
  @attr('string') declare previousShrimpoEntrySlug: string;

  @attr('number') declare ranking: string;
  @attr('string') declare totalScore: string;

  @attr('string') declare shrimpoStatus: string;
  @attr('string') declare shrimpoType: string;
  @attr('string') declare shrimpoVotingCompletionPercentage: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo-entry': ShrimpoEntry;
  }
}
