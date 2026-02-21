import { Model, attr, belongsTo } from '../../../framework/index.js';

export default class FruitTicketGift extends Model {
  @belongsTo('user', {
    async: false,
    inverse: null
  }) toUser: any;

  @attr('number') declare amount: string;
  @attr('string') declare toUserId: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.}
