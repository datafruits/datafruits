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

  get showHypeMeter() {
    return this.chat.limitBreakActivated;
  }

  @service chatText;

  @tracked nick = '';
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
    this.chat.newMessagesBelow = true;
  }

  @action
  onScroll() {
    if (this.chat.checkScrolledToBottom()) {
      this.chat.isScrolledToBottom = true;
      this.chat.newMessagesBelow = false;
    } else {
      this.chat.isScrolledToBottom = false;
    }
    this.chat.scrollTop = document.getElementById('messages').scrollTop;
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