import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';

interface ForumThreadListSignature {
  Args: {
    forumThreads: [ForumThread];
  };
}

export default class ForumThreadList extends Component<ForumThreadListSignature> {
  get sortedThreads() {
    return this.args.forumThreads.sortBy('updatedAt').reverse();
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ForumThreadList: typeof ForumThreadList;
  }
}
  
