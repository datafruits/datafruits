import Model, { attr, belongsTo } from '@ember-data/model';
import type User from 'datafruits13/models/user';

export default class CustomEmoji extends Model {
  @attr('string') declare name: string;
  @attr('string') declare image: string;
  @attr('string') declare imageUrl: string;
  @attr() declare emojiUsers: string[];
  @belongsTo('user', { async: false, inverse: null }) declare user: User;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'custom-emoji': CustomEmoji;
  }
}
