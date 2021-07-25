import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class DatafruitsChat extends Component {
  @service
  chat;

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
  enterChatAnonymously() {
    const nick = this.nick.trim();
    this.chat.push('authorize', { user: nick, timestamp: Date.now() });
  }

  @action
  enterChat(nick, pass) {
    this.isJoiningChat = true;
    nick = nick.trim();
    // can convert to this.args when its a glimmer component
    return this.args.authenticate(nick, pass); // eslint-disable-line ember/no-attrs-in-components
  }

  @action
  newMessagesAvailable() {
    this.newMessagesBelow = true;
  }

  @action
  onScroll() {
    if (this.scrolledToBottom()) {
      this.newMessagesBelow = false;
    } else {
      this.newMessagesBelow = true;
    }
    this.chat.scrollTop = document.getElementById('messages').scrollTop;
  }

  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  }

  @action
  didInsert() {
    const messages = document.getElementById('messages');
    messages.scrollTop = this.chat.scrollTop;
  }
}
