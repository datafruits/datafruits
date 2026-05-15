import Model, { attr } from '@ember-data/model';

export default class UserEmoji extends Model {
  @attr('number') declare userId: number;
  @attr('number') declare customEmojiId: number;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'user-emoji': UserEmoji;
  }
}
