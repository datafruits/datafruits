import { Model, attr, belongsTo } from '../../../framework/index.js';
import type User from './user';

export default class FruitSummon extends Model {
  @attr('string') declare name: string;
  @belongsTo('user', {
    async: true,
    inverse: null
  }) declare user: User;
}
// }
