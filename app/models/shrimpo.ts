import Model, { attr, hasMany, belongsTo, type SyncHasMany } from '@ember-data/model';
import { inject as service } from '@ember/service';
import type ShrimpoEntry from './shrimpo-entry';
import type ShrimpoVotingCategory from './shrimpo-voting-category';
import type Post from './post';
import type User from './user';

export default class Shrimpo extends Model {
  @service declare intl: any;

  @belongsTo('user') declare user: User;
  @hasMany('shrimpo-entry', { async: false }) declare shrimpoEntries: SyncHasMany<ShrimpoEntry>;
  @hasMany('shrimpo-voting-category', { async: false }) declare shrimpoVotingCategories: SyncHasMany<ShrimpoVotingCategory>;
  @hasMany('posts', { async: false }) declare posts: SyncHasMany<Post>;

  @attr('string') declare title: string;
  @attr('string') declare username: string;
  @attr('string') declare userAvatar: string;
  @attr('string', { defaultValue: (new Date()).toISOString()}) declare startAt: string;
  @attr('string') declare endAt: string;

  @attr('string', { defaultValue: '1 hour' }) declare duration: string;

  @attr('string') declare rulePack: string;

  @attr('string') declare zipFileUrl: string;
  @attr('string') declare entriesZipFileUrl: string;

  @attr('string') declare zip: string;

  @attr('string') declare coverArt: string;
  @attr('string') declare coverArtUrl: string;

  @attr('string') declare status: 'running' | 'voting' | 'completed';
  @attr('string') declare slug: string;

  @attr('string') declare emoji: string;

  @attr('date') declare endedAt: string;

  @attr('string') declare entriesCount: string;

  @attr('string') declare shrimpoType: 'normal' | 'mega';

  @attr('string') declare votingCompletionPercentage: string;

  @attr('boolean') declare multiSubmitAllowed: boolean;

  get translatedStatus() {
    return this.intl.t(`shrimpo.status.${this.status}`);
  }

  get savedShrimpoEntries() {
    if(this.status === 'completed') {
      return this.shrimpoEntries.sortBy('ranking');
    } else {
      return this.shrimpoEntries.filter(entry => {
        return !entry.isNew;
      });
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'shrimpo': Shrimpo;
  }
}
