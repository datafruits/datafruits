import Model, { attr, belongsTo } from '@ember-data/model';

export default class FruitTicketGift extends Model {
  @attr('number') declare amount: string;
  @belongsTo('user') toUser: any;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    'fruit-ticket-gift': FruitTicketGift;
  }
}
