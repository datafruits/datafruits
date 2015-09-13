import Ember from 'ember';
import {Socket, LongPoller} from "phoenix";

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[<>"']/g, function (s) {
    return entityMap[s];
  });
}

var imgRegex = /https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^\/#?]+)+\.(?:jpg|gif|png)/;

function addToUserList(username){
  var new_user = Ember.$('<li class="userlist-item" data-username="'+username+'" />');
  var message = Ember.$('<span>');
  message.html(emojione.shortnameToImage(escapeHtml(username)));
  new_user.append(message);
  Ember.$('ul#userlist').append(new_user);
}

function removeFromUserList(username){
  Ember.$('li.userlist-item[data-username="'+username+'"]').remove();
}

function addChatMessage(data) {
  var new_message = Ember.$('<li class="message" />');
  var message = Ember.$('<span class="message-body">');
  message.html(emojione.shortnameToImage(escapeHtml(data.body).autoLink({ target: "_blank", })));
  var username = Ember.$('<span class="username">');
  username.html(emojione.shortnameToImage(escapeHtml(data.user)));
  new_message.append(username, message);
  Ember.$('#messages').append(new_message);
  Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
  if(isImage(data.body)) {
    addImage(data.body.match(imgRegex)[0]);
  }
}

function addJoinedMessage(name) {
  var new_message = Ember.$('<li class="message" />');
  var message = Ember.$('<span class="message-body">');
  message.html(emojione.shortnameToImage(' joined the chat :raising_hand:'));
  var username = Ember.$('<span class="username">');
  username.text(name);
  new_message.append(username, message);
  Ember.$('#messages').append(new_message);
  Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
}

function addLeftMessage(name) {
  var new_message = Ember.$('<li class="message" />');
  var message = Ember.$('<span class="message-body">');
  message.html(emojione.shortnameToImage(' left the chat :dash:'));
  var username = Ember.$('<span class="username">');
  username.text(name);
  new_message.append(username, message);
  Ember.$('#messages').append(new_message);
  Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
}

function isImage(url){
  return imgRegex.test(url);
}

function addImage(url){
  var new_message = Ember.$('<li class="message" />');
  var message = Ember.$('<span class="message-body">');
  var image = new Image();
  image.src = url;
  message.append(Ember.$(image));
  new_message.append(message);
  Ember.$('#messages').append(new_message);
  Ember.$('#messages')[0].scrollTop = Ember.$('#messages')[0].scrollHeight;
}

function cleanMessage(input){
  return Ember.$('<div/>').text(input).text();
}

export default Ember.Component.extend({
  actions: {
    enterChat: function(){
      var nick = cleanMessage(Ember.$('input[name=nick]').val().trim());
      console.log('emitting nick: '+nick);
      //socket.emit('JOIN', nick);
      this.chan.push("authorize", { user: nick });
    },
    sendMessage: function(){
      var message = Ember.$('#input-message').val();
      message = cleanMessage(message);
      console.log('message: '+message);
      if(message){
        //socket.emit('SENT_MSG', message);
        this.chan.push("new:msg", { user: this.get('username'), body: message });
        Ember.$('#input-message').val('');
      }
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
    var $messages = Ember.$("#messages");
    var $input = Ember.$("#input-message");

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

    this.chan.on("new:msg", function (msg) {
      addChatMessage(msg);
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

    this.chan.on("user:left", function(msg) {
      if(msg.user !== null){
        addLeftMessage(msg.user);
        removeFromUserList(msg.user);
      }
    });

    this.chan.on("user:authorized", function(msg) {
      addJoinedMessage(msg.user);
      addToUserList(msg.user);
    });

    this.chan.on("join", function(msg) {
      for(var i = 0; i < msg.users.length; i++){
        addToUserList(msg.users[i]);
      }
    });

    this.chan.on("user:entered", function (msg) {
      //user entered room, but nick not authorized yet
    });

    Ember.$('#enter-chat').submit(function(event) {
      event.preventDefault();
    });
  }.on('didInsertElement')
});
