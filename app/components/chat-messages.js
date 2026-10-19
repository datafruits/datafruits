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
    element.addEventListener('scroll', this._onScroll.bind(this), { passive: true });
    element.addEventListener('touchmove', this._onScroll.bind(this), { passive: true });
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
    if (this.scrolledToBottom()) {
      this.willAutoscroll = true;
    } else {
      this.args.newMessagesAvailable();
      this.willAutoscroll = false;
    }
  }

  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    // Allow a buffer of 100px to account for newly injected message heights
    const result = messages.scrollHeight - messages.scrollTop - messagesHeight < 100;
    return result;
  }
}
