//import Ember from 'ember';
import Service from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import {Socket/*, LongPoller*/} from "phoenix";
import ENV from "datafruits13/config/environment";

export default Service.extend({
  joinedUsers: ArrayProxy.create({ content: A() }),
  messages: ArrayProxy.create({ content: A() }),
  joinedChat: false,
  gifsEnabled: true,
  push(message, object) {
    this.chan.push(message, object);
  },
  init() {
    let socket = new Socket(ENV.CHAT_SOCKET_URL, {

      logger: function logger(/*kind, msg, data*/) {
        //console.log(kind + ": " + msg, data);
      },
      params: { user_id: "123" }
    });

    socket.connect();

    socket.onOpen(function (/*ev*/) {
      //return console.log("OPEN", ev);
    });
    socket.onError(function (/*ev*/) {
      //return console.log("ERROR", ev);
    });
    socket.onClose(function (/*e*/) {
      //return console.log("CLOSE", e);
    });

    this.chan = socket.channel("rooms:lobby", {});

    this.chan.join().receive("ignore", function () {
      //return console.log("auth error");
    }).receive("ok", function () {
      //return console.log("join ok");
    }).receive("timeout", function () {
      //return console.log("Connection interruption");
    });

    this.chan.onError(function (/*e*/) {
      //return console.log("something went wrong", e);
    });

    this.chan.onClose(function (/*e*/) {
      //return console.log("channel closed", e);
    });

    this.chan.on("new:msg", (msg) => {
      this.messages.pushObject(msg);
    });

    var self = this;
    this.chan.on("authorized", function (msg) {
      self.set("username", msg.user);
      self.set("joinedChat", true);
      //Ember.$('#input-message').focus();
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

    this.chan.on("user:entered", function (/*msg*/) {
      //user entered room, but nick not authorized yet
    });
  }
});
