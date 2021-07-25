import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';

export default class ChatMessages extends Component {
  @tracked willAutoscroll = false;

  touchMove() {
    this._onScroll();
  }

  scroll() {
    this._onScroll();
  }

  _onScroll() {
    debounce(this, this.onScroll, 500);
  }

  @action
  setupAutoscroll() {
    if (this.scrolledToBottom()) {
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
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  }
}
