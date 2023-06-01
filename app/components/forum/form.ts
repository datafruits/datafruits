import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface ForumFormArgs {
  thread: ForumThread;
}

export default class ForumForm extends Component<ForumFormArgs> {
  @service declare router: any;

  @action saveThread(event: any) {
    event.preventDefault();
    const thread = this.args.thread;
    try {
      thread.save().then(() => {
        alert('posted !!!!');
        this.router.transitionTo('home.forum.show', thread);
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
  
