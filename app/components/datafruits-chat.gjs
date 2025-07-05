import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';
import t from "ember-intl/helpers/t";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import ChatMessages from "./chat-messages.js";
import UserListItem from "./user-list-item.gjs";
import InputMessage from "./chat/input-message.ts";
import { on } from "@ember/modifier";
import { Input } from "@ember/component";
import ChatSettings from "./chat-settings.ts";
import LoginModal from "./login-modal.js";

export default class DatafruitsChat extends Component {<template><div class="flex flex-col flex-grow min-h-0 flex-basis-0 overflow-hidden md:px-8 mt-5">
  {{#if @isAuthenticating}}
    <h1>{{t "chat.logging_you_in"}}</h1>
  {{else if this.chat.loading}}
    <h1>{{t "chat.loading"}}</h1>
  {{else}}
    <div id="chat-area" class="font-bold flex flex-row flex-grow min-h-0 relative text-shadow mb-5 flex-basis-0" style={{this.color}} {{didInsert this.didInsert}}>
      <ChatMessages @messages={{this.chat.messages}} @gifsEnabled={{this.chat.gifsEnabled}} @newMessagesAvailable={{this.newMessagesAvailable}} @onScroll={{this.onScroll}} />
      {{#if this.newMessagesBelow}}
        <div class="text-white bg-df-green bg-opacity-75 absolute bottom-0 left-0 w-full">
          <span>{{t "chat.new_messages"}}</span>
        </div>
      {{/if}}
      {{#if @networkStatus.isOffline}}
        <div id="offline">
          <span>{{t "chat.offline"}}</span>
        </div>
      {{/if}}
      <ul id="userlist" class="overflow-y-scroll flex-grow hidden md:block md:w-1/5 pl-4">
        {{#each-in this.chat.presences as |username user|}}
          <UserListItem @user={{user}} />
        {{/each-in}}
      </ul>
    </div>
    <div class="flex flex-col justify-center items-center w-full">
      {{#if this.chat.joinedChat}}
        <div align="center" class="mb-3 w-full">
          <InputMessage @isOffline={{@networkStatus.isOffline}} />
        </div>
      {{else}}
        <form align="center" class="mb-3" {{on "submit" this.enterChatAnonymously}}>
          {{!-- Nickname input + Join chat button --}}
          <div class="flex justify-center">
            <label for="nick">{{t "chat.label.nick"}}</label>
            <Input @type="text" @value={{this.nick}} autocorrect="off" autocapitalize="none" class="max-h-full mx-2" placeholder={{t "chat.nickname"}} />
            <input data-test-join-chat class="cool-button" type="submit" disabled={{this.disableJoinButton}} title={{t "chat.titles.enter"}} value={{t "chat.join_anonymously"}} />
            <ChatSettings />
          </div>
          {{!-- CoC --}}
          <div>
            <label class="text-xs" for="agree-to-coc">
              {{t "chat.coc_label"}}
            </label>
            <a class="text-sm" href="/coc"><abbr title={{t "code_of_conduct"}}>{{t "chat.label.coc"}}</abbr></a>
          </div>
          {{!-- Login Button --}}
          <div class="flex justify-center">
            <button {{on "click" this.toggleLoginModal}} type="button" class="cool-button" title={{t "chat.titles.login"}} data-test-login-button>
              {{t "chat.login"}}
            </button>
          </div>
        </form>
      {{/if}}
    </div>
    {{#if this.showingLoginModal}}
      <LoginModal @login={{action "enterChat"}} @toggleModal={{action "toggleLoginModal"}} />
    {{/if}}
  {{/if}}
</div></template>
  @service chat;

  get color() {
    return this.chatText.color;
  }

  @service chatText;

  @tracked nick = '';
  @tracked newMessagesBelow = false; // TODO move this to chat service
  @tracked isJoiningChat = false;

  @tracked
  showingLoginModal = false;

  get disableJoinButton() {
    return this.nick.length < 1 || this.isJoiningChat;
  }

  @action
  toggleLoginModal() {
    this.showingLoginModal = !this.showingLoginModal;
  }

  @action
  toggleGifsEnabled() {
    this.chat.gifsEnabled = !this.chat.gifsEnabled;
  }

  @action
  enterChatAnonymously(e) {
    e.preventDefault();
    const nick = this.nick.trim();
    this.chat.push('authorize', { user: nick, timestamp: Date.now() });
  }

  @action
  enterChat(nick, pass) {
    this.isJoiningChat = true;
    nick = nick.trim();
    return this.args.authenticate(nick, pass);
  }

  @action
  newMessagesAvailable() {
    this.newMessagesBelow = true;
  }

  @action
  onScroll() {
    if (this.checkScrolledToBottom()) {
      this.chat.isScrolledToBottom = true;
      this.newMessagesBelow = false;
    } else {
      this.chat.isScrolledToBottom = false;
      this.newMessagesBelow = true;
    }
    this.chat.scrollTop = document.getElementById('messages').scrollTop;
  }

  checkScrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  }

  @action
  didInsert() {
    const messages = document.getElementById('messages');
    messages.scrollTop = this.chat.scrollTop;
    window.setInterval(() => {
      this.virusTimer -= 1;
    }, 1000);
  }

  @tracked
  virusTimer = 3000;

  @tracked
  closedModal = false;

  get virusInfected() {
    return this.virusTimer <= 0 && !this.closedModal;
  }

  @action
  closeModal() {
    this.closedModal = true;
  }
}
