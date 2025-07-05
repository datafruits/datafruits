import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import { Textarea, Input } from "@ember/component";

interface PostFormSignature {
  Args: {
    postable: ForumThread | ScheduledShow;
    postableType: 'ForumThread' | 'ScheduledShow';
  };
}

export default class PostForm extends Component<PostFormSignature> {<template><form {{on "submit" this.savePost}}>
  <div>
    <label class="block text-sm font-bold mb-2" for="body">{{t "forum.form.body"}}</label>
    <Textarea @value={{this.body}} rows="5" cols="100" />
  </div>
  <div>
    <Input class="cool-button" @type="submit" @value={{t "forum.form.save"}} disabled={{this.cantSave}} />
  </div>
</form></template>
  @tracked body: string = '';

  @service declare store: any;

  get cantSave() {
    return !this.body.length;
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

