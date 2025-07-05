import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import willDestroy from "@ember/render-modifiers/modifiers/will-destroy";
import ChatMessage from "./chat-message.js";

export default class ChatMessages extends Component {<template><ul class="overflow-y-scroll w-screen border-none md:border-r-2 border-white border-solid" id="messages" {{didInsert this.addListener}} {{willDestroy this.removeListener}}>
    {{#each @messages as |message|}}
    <ChatMessage @message={{message}} @gifsEnabled={{@gifsEnabled}} @newMessagesAvailable={{@newMessagesAvailable}} @setupAutoscroll={{this.setupAutoscroll}} @adjustScrolling={{this.adjustScrolling}} />
  {{/each}}
</ul>
</template>
  @service
  chat;

  @tracked willAutoscroll = false;

  _onScroll() {
    debounce(this, this.args.onScroll, 500);
  }

  @action
  addListener(element) {
    element.addEventListener('scroll', this._onScroll.bind(this), { passive: true });
    element.addEventListener('touchmove', this._onScroll.bind(this), { passive: true });
  }

  @action
  removeListener(element) {
    element.removeEventListener('scroll', this._onScroll);
    element.removeEventListener('touchmove', this._onScroll);
  }

  @action
  setupAutoscroll() {
    if (this.chat.isScrolledToBottom) {
      this.willAutoscroll = true;
    } else {
      this.args.newMessagesAvailable();
      this.willAutoscroll = false;
    }
  }

  @action
  adjustScrolling() {
    if (this.willAutoscroll) {
      const messages = document.getElementById('messages');
      messages.scrollTop = messages.scrollHeight;
    }
  }

  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    const result = messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
    return result;
  }
}
