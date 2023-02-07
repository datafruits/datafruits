import Model, { attr, hasMany } from '@ember-data/model';
//import type User from './user';
//import type Post from './post';

export default class ForumThread extends Model {
  @attr('string') declare title: string;
  @attr('string') declare body: string;
  //@belongsTo('user', { async: true }) declare user: User;
  @hasMany('posts', { async: false }) declare posts: any;

  @attr('string') declare posterUsername: string;
  @attr('string') declare posterAvatar: string;
  @attr('string') declare createdAt: string;
  @attr('string') declare updatedAt: string;
  @attr('string') declare slug: string;

  @attr('number') declare repliesCount: number;

  @attr() declare replyPosterAvatars: any;

  get sortedPosts() {
    return this.posts.sortBy('createdAt');
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your models.
// declare module 'ember-data/types/registries/model' {
//   export default interface ModelRegistry {
//     'forum-thread': ForumThread;
//   }
// }
