import Component from '@glimmer/component';
import { isEmpty } from '@ember/utils';
import Username from "./chat/username.js";

export default class UserListItem extends Component {<template><li class="userlist-item">
  <span class="flex items-center space-x-2 justify-start mr-4">
    {{#if this.avatarUrl}}
      <img class="inline rounded-md" style="height: 20px;" src="{{this.avatarUrl}}" align="center" alt={{this.username}} />
    {{/if}}
    <span>
      <Username @role={{this.role}} @style={{this.style}} @pronouns={{this.pronouns}} @username={{this.username}} @avatarUrl={{this.avatarUrl}} />
    </span>
  </span>
</li>
</template>
  get avatarUrl() {
    const avatarUrl = this.args.user.metas[0].avatarUrl;
    if (isEmpty(avatarUrl)) {
      return '/assets/images/show_placeholder.jpg';
    } else {
      return avatarUrl;
    }
  }

  get username() {
    return this.args.user.metas[0].username;
  }

  get role() {
    return this.args.user.metas[0].role;
  }

  get style() {
    return this.args.user.metas[0].style;
  }

  get pronouns() {
    return this.args.user.metas[0].pronouns;
  }

  get isDj() {
    let role = this.args.user.metas[0].role;
    if (!role) return false;
    return this.message.role.includes('dj') || this.message.role.includes('admin');
  }
}
