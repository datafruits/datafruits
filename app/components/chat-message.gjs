import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import formatMessageTimestamp from "../helpers/format-message-timestamp.js";
import Username from "./chat/username.js";
import t from "ember-intl/helpers/t";
import Icon from "./ui/icon.js";
import { on } from "@ember/modifier";
import formatMessageBody from "../helpers/format-message-body.js";
import ChatLazyImage from "./chat-lazy-image.js";

export default class ChatMessage extends Component {<template><li {{didInsert this.setScrolling}} class="message">
  <span class="mr-2">
    {{formatMessageTimestamp @message.timestamp}}
  </span>

  {{#if this.canShowAvatar}}
    {{#if @message.avatarUrl}}
      <span class="mr-2" data-test-avatar>
        <img class="inline rounded-md" style="height: 20px;" src="{{@message.avatarUrl}}" alt={{@message.user}}>
      </span>
    {{else}}
      <span class="mr-2" data-test-avatar>
        <img class="inline rounded-md" style="height: 20px;" src="/assets/images/show_placeholder.jpg" alt={{@message.user}}>
      </span>
    {{/if}}
  {{/if}}

  <span class="{{if this.fromDiscord "" "mr-2"}}" data-test-username>
    <Username @dontShowPopup={{true}} @role={{@message.role}} @style={{@message.style}} @pronouns={{@message.pronouns}} @username={{if this.fromDiscord this.discordUser @message.user}} @avatarUrl={{@message.avatarUrl}} />
  </span>

  {{#if this.fromDiscord}}
    <a class="mr-2" href="https://discord.gg/83mteTQDvu" title={{t "chat.discord"}} aria-label={{t "discord.aria"}} target="_blank" rel="noopener noreferrer">
      <Icon @name="discord" @prefix="fab" />
    </a>
  {{/if}}

  {{#if @message.treasure}}
    <span class="futsu-treasure-chest" {{on "click" this.grabTreasure}}>
      <img src="/assets/images/cominghand.gif" class="grab" />
      <button class="cool-button" {{on "click" this.grabTreasure}} disabled={{this.cantOpenTreasure}}>
        <img src="/assets/images/treasure_chest.gif" style="height: 3rem;" />
      </button>
    </span>
  {{/if}}

  {{#unless (this.hasImageData)}}
    <span class={{if @message.hasMention "bg-df-green-dark"}} data-test-message-body>
      {{formatMessageBody (if this.fromDiscord this.discordMsg this.messageText)}}
    </span>
  {{/unless}}

</li>
{{#if @gifsEnabled}}
  {{#if this.hasImageData}}
    <li class="message">
      <span class>
        <ChatLazyImage @url={{this.imgUrl}} @adjustScrolling={{@adjustScrolling}} />
      </span>
    </li>
  {{/if}}
{{/if}}</template>
  @tracked gifsEnabled = true;
  @service chat;
  @service currentUser;
  @service session;
  @service intl;

  imgRegex = /https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|jpeg|gif|png|webp)(\?.*$)*/i;
  dataRegex = /data:image\/.+;base64,.+/;
  discordRegex = /^New\ msg\ in\ discord\ from\ (.+):\ (.+)$/; // eslint-disable-line no-useless-escape

  get canShowAvatar() {
    if (!this.args.message.role) return false;
    return (
      this.args.message.role.includes('dj') ||
      this.args.message.role.includes('admin') ||
      this.args.message.role.includes('listener') ||
      this.args.message.role.includes('bot')
    );
  }

  get hasImage() {
    return this.imgRegex.test(this.args.message.body);
  }

  get hasData() {
    return this.dataRegex.test(this.args.message.body);
  }

  get hasImageData() {
    return this.hasImage || this.hasData;
  }

  get imgUrl() {
    if (this.hasImage)
      return this.args.message.body.match(this.imgRegex)[0];

    if (this.hasData)
      return this.args.message.body.match(this.dataRegex)[0];

    return ""
  }

  get messageText() {
    var body = this.args.message.body;

    if (this.hasImage) {
      body = this.args.message.body.replace(this.imgRegex, "");
    }
    if (this.hasData) {
      body = this.args.message.body.replace(this.dataRegex, "");
    }

    return body;
  }

  get fromDiscord() {
    return this.discordRegex.test(this.args.message.body) && this.args.message.user == "coach";
  }

  get discordUser() {
    return this.args.message.body.match(this.discordRegex)[1];
  }

  get discordMsg() {
    return this.args.message.body.match(this.discordRegex)[2];
  }

  @action
  setScrolling() {
    this.args.setupAutoscroll();
    this.args.adjustScrolling();
  }

  @action
  grabTreasure() {
    if(this.session.isAuthenticated) {
      console.log('grabbing treasure...');
      // send treasure:open to chat
      // we'll need to send a token...
      this.chat.push("treasure:open", {
        user: this.currentUser.user.username,
        token: this.chat.token,
        treasure: this.args.message.treasure,
        amount: this.args.message.amount,
        uuid: this.args.message.uuid,
        timestamp: Date.now(),
      });
    } else {
      alert("you need to login to open treasure!");
    }
  }

  get cantOpenTreasure() {
    return this.args.message.treasureLocked || this.args.message.treasureOpened;
  }
}
