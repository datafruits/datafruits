import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import type Shrimpo from 'datafruits13/models/shrimpo';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { Textcomplete } from '@textcomplete/core';
import { TextareaEditor } from '@textcomplete/textarea';
import { createEmojiAutocomplete } from 'datafruits13/utils/emoji-autocomplete';

interface PostFormSignature {
  Args: {
    postable: ForumThread | ScheduledShow | Shrimpo | ShrimpoEntry;
    postableType: 'ForumThread' | 'ScheduledShow' | 'Shrimpo' | 'ShrimpoEntry';
  };
}

export default class PostForm extends Component<PostFormSignature> {
  @tracked body: string = '';

  @service declare store: any;

  get cantSave() {
    return !this.body.length;
  }

  @action
  didInsertForm() {
    const emojiComplete = createEmojiAutocomplete();
    const textarea: unknown = document.querySelector('#post-form-body');
    if (textarea) {
      const editor = new TextareaEditor(textarea as HTMLTextAreaElement);
      new Textcomplete(editor, [emojiComplete], {
        dropdown: {
          maxCount: 10,
          placement: 'top',
        },
      });
    }
  }

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
        postable.posts.push(post);
        this.body = '';
        next(this, () => {
          const forumPosts = document.querySelectorAll("section.post");
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

