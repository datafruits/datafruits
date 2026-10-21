import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChatMessages extends Component {
  @service
  chat;

  @tracked willAutoscroll = false;

  @action
  _onScroll() {
    if (this.args.onScroll) {
      this.args.onScroll();
    }
  }

  @action
  addListener(element) {
    element.addEventListener('scroll', this._onScroll, { passive: true });
    element.addEventListener('touchmove', this._onScroll, { passive: true });
  }

  @action
  removeListener(element) {
    element.removeEventListener('scroll', this._onScroll);
    element.removeEventListener('touchmove', this._onScroll);
  }

  @action
  adjustScrolling() {
    if (this.willAutoscroll) {
      const messages = document.getElementById('messages');
      messages.scrollTop = messages.scrollHeight;
    }
  }

  @action
  setupAutoscroll() {
    if (this.chat.isScrolledToBottom || this.chat.checkScrolledToBottom()) {
      this.willAutoscroll = true;
    } else {
      this.args.newMessagesAvailable();
      this.willAutoscroll = false;
    }
  }

}