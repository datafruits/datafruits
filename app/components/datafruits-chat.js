import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { formatEmojiHtml } from 'datafruits13/helpers/format-emoji-html';

export default class DatafruitsChat extends Component {
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
