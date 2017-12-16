import Ember from 'ember';
import emojiStrategy from "../emojiStrategy";

export default Ember.Component.extend({
  tagName: "span",
  chat: Ember.inject.service(),
  username: Ember.computed.oneWay('chat.username'),
  joinedUsers: Ember.computed.oneWay('chat.joinedUsers'),
  actions: {
    sendMessage(){
      const message = this.get('inputMessage');
      if(message){
        this.get('chat').push("new:msg", { user: this.get('username'), body: message, timestamp: Date.now() });
        this.set('inputMessage', '');
      }
    }
  },

  setupTextComplete: function(){
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
          if(emojiStrategy[shortname].custom){
            return '<img class="emojione" src="/assets/images/emojis/'+emojiStrategy[shortname].unicode+'.png"> '+shortname;
          }else{
            return '<img class="emojione" src="//cdn.jsdelivr.net/emojione/assets/png/'+emojiStrategy[shortname].unicode+'.png"> '+shortname;
          }
        },
        replace: function (shortname) {
          return shortname;
        },
        index: 1,
        maxCount: 10
      },
      {
        id: "usernames",
        match: /\b(\w{2,})$/,
        search: (term, callback) => {
          let matches;
          matches = this.get('joinedUsers').filter((word) => {
            return (word.indexOf(term) === 0) && (word !== this.get('username'));
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
  }.on('didInsertElement')
});
