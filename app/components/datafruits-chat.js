import Ember from 'ember';
import {Socket, LongPoller} from "phoenix";
import emojiStrategy from "../emojiStrategy";

export default Ember.Component.extend({
  //classNames: ['chat'],
  messages: Ember.ArrayProxy.create({ content: Ember.A() }),
  joinedUsers: Ember.ArrayProxy.create({ content: Ember.A() }),
  gifsEnabled: true,
  newMessagesBelow: false,
  isJoiningChat: false,
  actions: {
    toggleGifsEnabled: function(){
      this.toggleProperty("gifsEnabled");
    },
    enterChat: function(){
      this.set('isJoiningChat', true);
      const nick = Ember.$('input[name=nick]').val().trim();
      this.chan.push("authorize", { user: nick, timestamp: Date.now() });
    },
    sendMessage: function(){
      var message = Ember.$('#input-message').val();
      if(message){
        this.chan.push("new:msg", { user: this.get('username'), body: message, timestamp: Date.now() });
        Ember.$('#input-message').val('');
      }
    },
    newMessagesAvailable: function(){
      this.set("newMessagesBelow", true);
    }
  },
  scrolledToBottom: function() {
    return Ember.$('#messages')[0].scrollHeight - Ember.$('#messages')[0].scrollTop - Ember.$('#messages').outerHeight() < 1;
  },
  _onScroll: function(){
    if(this.scrolledToBottom()){
      this.set("newMessagesBelow", false);
    }else{
      this.set("newMessagesBelow", true);
    }
  },
  setupChat: function(){
    //var socket = new Socket("ws://localhost:4000/socket", {
    var socket = new Socket("ws://hotdog-lounge.herokuapp.com/socket", {
      logger: function logger(kind, msg, data) {
        console.log(kind + ": " + msg, data);
      }
    });

    socket.connect({ user_id: "123" });

    socket.onOpen(function (ev) {
      return console.log("OPEN", ev);
    });
    socket.onError(function (ev) {
      return console.log("ERROR", ev);
    });
    socket.onClose(function (e) {
      return console.log("CLOSE", e);
    });

    this.chan = socket.channel("rooms:lobby", {});

    this.chan.join().receive("ignore", function () {
      return console.log("auth error");
    }).receive("ok", function () {
      return console.log("join ok");
    }).after(10000, function () {
      return console.log("Connection interruption");
    });

    this.chan.onError(function (e) {
      return console.log("something went wrong", e);
    });

    this.chan.onClose(function (e) {
      return console.log("channel closed", e);
    });

    this.chan.on("new:msg", (msg) => {
      this.messages.pushObject(msg);
    });

    var self = this;
    this.chan.on("authorized", function (msg) {
      self.set("username", msg.user);
      Ember.$('#enter-chat').hide();
      Ember.$('#send-message').show();
      Ember.$('#input-message').focus();
    });

    this.chan.on("notauthorized", function(msg) {
      alert(msg.error);
    });

    this.chan.on("user:left", (msg) => {
      if(msg.user !== null){
        let leftMessage = { user: msg.user, body: ' left the chat :dash:', timestamp: msg.timestamp };
        this.messages.pushObject(leftMessage);
        this.joinedUsers.removeObject(msg.user);
      }
    });

    this.chan.on("user:authorized", (msg) => {
      let joinedMessage = { user: msg.user, body: ' joined the chat :raising_hand:', timestamp: msg.timestamp };
      this.messages.pushObject(joinedMessage);
      this.joinedUsers.pushObject(msg.user);
      //addToUserList(msg.user);
    });

    this.chan.on("join", (msg) => {
      this.joinedUsers.pushObjects(msg.users);
    });

    this.chan.on("user:entered", function (msg) {
      //user entered room, but nick not authorized yet
    });

    Ember.$('#enter-chat').submit(function(event) {
      event.preventDefault();
    });

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
