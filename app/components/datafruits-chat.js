import Ember from 'ember';

export default Ember.Component.extend({
  chat: Ember.inject.service(),
  classNames: ['main-content'],
  gifsEnabled: true,
  newMessagesBelow: false,
  isJoiningChat: false,
  joinedChat: Ember.computed.oneWay('chat.joinedChat'),
  joinedUsers: Ember.computed.oneWay('chat.joinedUsers'),
  messages: Ember.computed.oneWay('chat.messages'),
  username: Ember.computed.oneWay('chat.username'),
  actions: {
    toggleGifsEnabled(){
      this.toggleProperty("gifsEnabled");
    },
    enterChat(){
      this.set('isJoiningChat', true);
      const nick = this.get('nick').trim();
      this.get('chat').push("authorize", { user: nick, timestamp: Date.now() });
    },
    sendMessage(){
      var message = this.get('inputMessage');
      if(message){
        this.get('chat').push("new:msg", { user: this.get('username'), body: message, timestamp: Date.now() });
        this.set('inputMessage', '');
      }
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
  },
  setupChat: function(){
    $("#input-message").textcomplete([
      {
        id: "emojis",
        match: /\B:([\-+\w]*)$/,
        search: function (term, callback) {
        var results = [];
        var results2 = [];
        var results3 = [];
        $.each(emojiStrategy,function(shortname,data) {
          if(shortname.indexOf(term) > -1) { results.push(shortname); }
          else {
            if((data.aliases !== null) && (data.aliases.indexOf(term) > -1)) {
              results2.push(shortname);
            }
            else if((data.keywords !== null) && (data.keywords.indexOf(term) > -1)) {
              results3.push(shortname);
            }
          }
        });
        if(term.length >= 3) {
          results.sort(function(a,b) { return (a.length > b.length); });
          results2.sort(function(a,b) { return (a.length > b.length); });
          results3.sort();
        }
        var newResults = results.concat(results2).concat(results3);

        callback(newResults);
        },
        template: function (shortname) {
          return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/'+emojiStrategy[shortname].unicode+'.png"> :'+shortname+':';
        },
        replace: function (shortname) {
          return ':'+shortname+': ';
        },
        index: 1,
        maxCount: 10
      },
      {
        id: "usernames",
        words: this.joinedUsers,
        match: /\b(\w{2,})$/,
        search: function (term, callback) {
          let matches = this.words.filter(function(word) {
            return (word.indexOf(term) === 0) && (word !== self.username);
          });
          callback(matches);
        },
        index: 1,
        replace: function (word) {
          return word + ' ';
        }
      }
      ],{
      footer: '<a href="http://www.emoji.codes" target="_blank">Browse All<span class="arrow">»</span></a>',
      className: 'emoji-autocomplete'
    });

    var onScroll = this._onScroll.bind(this);
    this.$("#messages").bind('touchmove', onScroll);
    this.$("#messages").bind('scroll', onScroll);
  }.on('didInsertElement')
});
