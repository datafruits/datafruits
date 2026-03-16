import Model, { attr } from '@ember-data/model';

export default class GiftSubscription extends Model {
  @attr('number') declare quantity: number;
  @attr('string') declare recipientUsername: string | null;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'gift-subscription': GiftSubscription;
  }
}
