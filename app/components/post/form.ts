import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

interface PostFormArgs {
  thread: ForumThread;
}

export default class PostForm extends Component<PostFormArgs> {
  @tracked body: string = '';

  @service declare store: any;

  @action
  savePost(event: any) {
    event.preventDefault();
    const thread = this.args.thread;
    const post = this.store.createRecord('post', {
      postableId: thread.id,
      postableType: 'ForumThread',
      body: this.body
    });
    try {
      post.save().then(() => {
        thread.posts.pushObject(post);
        alert('posted reply !!!!');
      });
    } catch (error) {
      alert('couldnt save post');
      console.log(error);
    }
  }
}
