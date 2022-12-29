import Model, { attr, belongsTo } from '@ember-data/model';
import type User from './user';

export default class ForumThread extends Model {
  @attr('string') declare title: string;
  @attr('string') declare body: string;
  @belongsTo('user', { async: true }) declare user: User;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'forum-thread': ForumThread;
//   }
// }
