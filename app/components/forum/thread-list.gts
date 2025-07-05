import Component from '@glimmer/component';
import type ForumThread from 'datafruits13/models/forum-thread';
import { LinkTo } from "@ember/routing";

interface ForumThreadListSignature {
  Args: {
    forumThreads: [ForumThread];
  };
}

export default class ForumThreadList extends Component<ForumThreadListSignature> {<template><ul>
  {{#each this.sortedThreads as |forumThread|}}
    <li class>
      <LinkTo class="bg-df-pink text-2xl rounded-lg p-2 mb-2 block hover:bg-white flex justify-between" @route="home.forum.show" @model={{forumThread.slug}}>
        <span>
          {{forumThread.title}}
        </span>
        <div class="flex">
          <span class="text-lg mr-2">
            {{forumThread.repliesCount}}
          </span>
          <span class="text-sm mr-2">
            {{forumThread.posterUsername}}
          </span>
          <span>
            <img style="height: 3rem;" class="inline rounded-lg" src="{{forumThread.posterAvatar}}" />
          </span>
          <span>
            {{#each forumThread.replyPosterAvatars as |avatar|}}
              <img style="height: 3rem;" class="inline rounded-lg" src="{{avatar}}" />
            {{/each}}
          </span>
        </div>
      </LinkTo>
    </li>
  {{/each}}
</ul>
</template>
  get sortedThreads() {
    return this.args.forumThreads.slice().sort((a: ForumThread, b: ForumThread) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ForumThreadList: typeof ForumThreadList;
  }
}
