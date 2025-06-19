import Model, { attr, belongsTo } from '@ember-data/model';
import type User from './user';
//import type ForumThread from './forum-thread';

export default class Post extends Model {
  @attr('string') declare body: string;
  //@belongsTo('forum-thread') declare forumThread: ForumThread;
  @belongsTo('user', {
    async: false,
    inverse: null
  }) declare user: User;

  @attr('string') declare posterUsername: string;
  @attr('string') declare posterAvatar: string;
  @attr('string') declare posterRole: string;
  @attr('string') declare createdAt: string;

  @attr('string') declare postableType: string;
  @attr('number') declare postableId: number;
}


// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'post': Post;
//   }
// }
