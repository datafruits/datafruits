import { Model, attr, belongsTo } from '../../../framework/index.js';
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
  @attr('string') declare postableId: string;
}

// }
