import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { debounce } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default class ChatMessages extends Component {
  @service
  chat;

  @tracked willAutoscroll = false;

  _onScroll() {
    debounce(this, this.args.onScroll, 500);
  }

  @action
  addListener(element) {
    element.addEventListener('scroll', this._onScroll.bind(this));
    element.addEventListener('touchmove', this._onScroll.bind(this));
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
