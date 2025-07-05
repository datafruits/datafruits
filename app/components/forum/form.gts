import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { on } from "@ember/modifier";
import t from "ember-intl/helpers/t";
import { Input, Textarea } from "@ember/component";

interface ForumFormSignature {
  Args: {
    thread: ForumThread;
  };
}

export default class ForumForm extends Component<ForumFormSignature> {<template><form {{on "submit" this.saveThread}}>
  <div>
    <label class="block text-sm font-bold mb-2" for="title">{{t "forum.form.title"}}</label>
    <Input @type="text" id="title" @value={{@thread.title}} />
  </div>
  <div>
    <label class="block text-sm font-bold mb-2" for="body">{{t "forum.form.body"}}</label>
    <Textarea @value={{@thread.body}} rows="5" cols="100" />
  </div>
  <div>
    <Input class="cool-button" @type="submit" @value={{t "forum.form.save"}} />
  </div>
</form></template>
  @service declare router: any;

  @action saveThread(event: any) {
    event.preventDefault();
    const thread = this.args.thread;
    try {
      thread.save().then(() => {
        alert('posted !!!!');
        this.router.transitionTo('home.forum.show', thread.slug);
      });
    } catch (error) {
      alert('couldnt save thread');
      console.log(error);
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ForumForm: typeof ForumForm;
  }
}

