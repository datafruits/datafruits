import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

@classic
@classNames('main-content')
export default class DatafruitsChat extends Component {
  @service
  chat;

  @oneWay('chat.gifsEnabled')
  gifsEnabled;

  newMessagesBelow = false; // TODO move this to chat service
  isJoiningChat = false;
  nick = '';

  @oneWay('chat.joinedChat')
  joinedChat;

  @oneWay('chat.messages')
  messages;

  @oneWay('chat.joinedUsers')
  joinedUsers;

  @computed('isJoiningChat', 'nick.length')
  get disableJoinButton() {
    return this.nick.length < 1 || this.isJoiningChat === true;
  }

  @action
  toggleGifsEnabled() {
    this.chat.toggleProperty('gifsEnabled');
  }

  @action
  enterChat() {
    this.set('isJoiningChat', true);
    const nick = this.nick.trim();
    this.chat.push('authorize', { user: nick, timestamp: Date.now() });
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
