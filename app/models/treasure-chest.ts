import { Model, attr } from '../../framework/index.js';

export default class TreasureChest extends Model {
  @attr('string') declare treasureName: string;
  @attr('number') declare amount: number;
  @attr('string') declare username: string;
  @attr('string') declare treasureUuid: string;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.}
