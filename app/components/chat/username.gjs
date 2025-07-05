import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { on } from "@ember/modifier";
import { LinkTo } from "@ember/routing";
import formatMessageUser from "../../helpers/format-message-user.js";
import eq from "ember-truth-helpers/helpers/equal";
import and from "ember-truth-helpers/helpers/and";
import Badges from "../user/badges.gts";
import t from "ember-intl/helpers/t";

export default class ChatUsernameComponent extends Component {<template><span {{on "mouseenter" this.showUserInfo}} {{on "mouseleave" this.hideUserInfo}} class="relative">
  {{#if this.canShowUserInfo}}
    <LinkTo class="hover:underline" @route="home.dj" @model={{@username}}>
      {{formatMessageUser @username}}
    </LinkTo>
  {{else}}
    {{formatMessageUser @username}}
  {{/if}}
  {{#unless (eq @dontShowPopup true)}}
    {{#if (and this.showingDjInfo this.canShowUserInfo)}}
      <div class="absolute top-10 left-0 classic:bg-df-blue blm:bg-black trans:theme-trans p-5 rounded-xl z-50 border-4 border-white z-50 shadow-md">
        <img class="inline rounded-lg" style="height: 2rem;" src="{{@avatarUrl}}" align="center" alt={{this.currentUser.user.username}}>
        <Badges @role={{@role}} />
        {{#if this.canShowUserInfo}}
          <LinkTo class="hover:underline" @route="home.dj" @model={{@username}}>
            {{@username}}
          </LinkTo>
        {{else}}
          {{@username}}
        {{/if}}
        <br />
        <span><i>{{t "profile.pronouns"}}:</i> {{@pronouns}}</span>
        <br />
        <span><i>{{t "profile.style"}}:</i> {{@style}}</span>
      </div>
    {{/if}}
  {{/unless}}
</span>
</template>
  @tracked showingDjInfo = false;

  get isDj() {
    if (!this.args.role) return false;
    return this.args.role.includes('dj') || this.args.role.includes('admin');
  }

  get canShowUserInfo() {
    if (!this.args.role) return false;
    return this.args.role.includes('dj') || this.args.role.includes('admin') || this.args.role.includes('listener');
  }

  @action
  showUserInfo() {
    if (!this.showingDjInfo) {
      this.showingDjInfo = true;
    }
  }

  @action
  hideUserInfo() {
    debounce(this, '_hideUserInfo', 200);
  }

  _hideUserInfo() {
    this.showingDjInfo = false;
  }
}
