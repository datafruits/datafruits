import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

interface PostFormArgs {
  postable: ForumThread | ScheduledShow;
  postableType: 'ForumThread' | 'ScheduledShow';
}

export default class PostForm extends Component<PostFormArgs> {
  @tracked body: string = '';

  @service declare store: any;

  @action
  savePost(event: any) {
    event.preventDefault();
    const postable = this.args.postable;
    const post = this.store.createRecord('post', {
      postableId: postable.id,
      postableType: this.args.postableType,
      body: this.body
    });
    try {
      post.save().then(() => {
        postable.posts.pushObject(post);
        this.body = '';
        next(this, () => {
          const forumPosts = document.querySelectorAll("section.post") as NodeListOf<Element>;
          const el = forumPosts[forumPosts.length-1];
          el.classList.add("bounce");
          (el as HTMLElement).focus();
        });
      });
    } catch (error) {
      alert('couldnt save post');
      console.log(error);
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PostForm: typeof PostForm;
  }
}

