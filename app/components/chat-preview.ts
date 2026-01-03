import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import type ChatService from 'datafruits13/services/chat';

interface ChatPreviewArgs {}

export default class ChatPreview extends Component<ChatPreviewArgs> {
  @service declare chat: ChatService;
  @tracked newMessagesBelow = false; // TODO move this to chat service

  @action
  onScroll() {
    if (this.checkScrolledToBottom()) {
      this.chat.isScrolledToBottom = true;
      this.newMessagesBelow = false;
    } else {
      this.chat.isScrolledToBottom = false;
      this.newMessagesBelow = true;
    }
  }

  checkScrolledToBottom() {
    const messages = document.getElementById('messages');
    if(messages) {
      const messagesHeight = messages.getBoundingClientRect().height;
      return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
    } else {
      return false;
    }
  }

}
