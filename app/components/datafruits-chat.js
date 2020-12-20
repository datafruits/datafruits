import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import { tracked } from '@glimmer/tracking';
import Component from '@ember/component';

export default class DatafruitsChat extends Component {
  @service
  chat;

  @oneWay('chat.gifsEnabled')
  gifsEnabled;

  @tracked agreeToCoC = false;
  @tracked nick = '';
  pass = '';
  newMessagesBelow = false; // TODO move this to chat service
  isJoiningChat = false;

  @tracked
  showingLoginModal = false;

  @oneWay('chat.joinedChat')
  joinedChat;

  @oneWay('chat.messages')
  messages;

  @oneWay('chat.joinedUsers')
  joinedUsers;

  @computed('isJoiningChat', 'nick.length')
  @action
  agreeChanged() {
    // input handler requires a function to exist for this to work correctly
    // ¯\_(~_~)_/¯
  }
  get disableJoinButton() {
    return !(this.agreeToCoC && this.nick.length > 1) || this.isJoiningChat;
  }

  @action
  toggleLoginModal() {
    this.showingLoginModal = !this.showingLoginModal;
  }

  @action
  toggleGifsEnabled() {
    this.chat.toggleProperty('gifsEnabled');
  }

  @action
  enterChatAnonymously() {
    const nick = this.nick.trim();
    this.chat.push('authorize', { user: nick, timestamp: Date.now() });
  }

  @action
  enterChat(nick, pass) {
    this.set('isJoiningChat', true);
    nick = nick.trim();
    // can convert to this.args when its a glimmer component
    return this.attrs.authenticate(nick, pass); // eslint-disable-line ember/no-attrs-in-components
  }

  @action
  newMessagesAvailable() {
    this.set('newMessagesBelow', true);
  }

  @action
  onScroll() {
    if (this.scrolledToBottom()) {
      this.set('newMessagesBelow', false);
    } else {
      this.set('newMessagesBelow', true);
    }
    this.chat.set('scrollTop', document.getElementById('messages').scrollTop);
  }

  scrolledToBottom() {
    const messages = document.getElementById('messages');
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 1;
  }

  didInsertElement() {
    //var onScroll = this._onScroll.bind(this);
    const messages = document.getElementById('messages');
    // this.$("#messages").bind('touchmove', onScroll);
    // this.$("#messages").bind('scroll', onScroll);
    messages.scrollTop = this.chat.scrollTop;
  }
}
