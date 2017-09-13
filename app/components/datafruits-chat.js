import Ember from 'ember';

export default Ember.Component.extend({
  chat: Ember.inject.service(),
  classNames: ['main-content'],
  gifsEnabled: Ember.computed.oneWay('chat.gifsEnabled'),
  newMessagesBelow: false,
  isJoiningChat: false,
  joinedChat: Ember.computed.oneWay('chat.joinedChat'),
  messages: Ember.computed.oneWay('chat.messages'),
  joinedUsers: Ember.computed.oneWay('chat.joinedUsers'),
  actions: {
    toggleGifsEnabled(){
      this.get("chat").toggleProperty("gifsEnabled");
    },
    enterChat(){
      this.set('isJoiningChat', true);
      const nick = this.get('nick').trim();
      this.get('chat').push("authorize", { user: nick, timestamp: Date.now() });
    },
    newMessagesAvailable(){
      this.set("newMessagesBelow", true);
    }
  },
  scrolledToBottom() {
    return Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop - Ember.$('#messages').outerHeight() < 1;
  },
  _onScroll(){
    if(this.scrolledToBottom()){
      this.set("newMessagesBelow", false);
    }else{
      this.set("newMessagesBelow", true);
    }
    this.get('chat').set('scrollTop', Ember.$('#messages')[0].scrollTop);
  },
  setupChat: function(){
    var onScroll = this._onScroll.bind(this);
    this.$("#messages").bind('touchmove', onScroll);
    this.$("#messages").bind('scroll', onScroll);
    this.$("#messages")[0].scrollTop = this.get('chat.scrollTop');
  }.on('didInsertElement')
});
