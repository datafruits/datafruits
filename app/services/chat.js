import Service from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import { Socket, Presence } from "phoenix";
import { computed } from '@ember/object';
import ENV from "datafruits13/config/environment";

export default Service.extend({
  joinedUsers: computed('presences', function(){
    return Object.keys(this.presences);
  }),
  messages: ArrayProxy.create({ content: A() }),
  joinedChat: false,
  gifsEnabled: true,
  push(message, object) {
    this.chan.push(message, object);
  },
  init() {
    this._super(...arguments);
    this.set('presences', {});
    let socket = new Socket(ENV.CHAT_SOCKET_URL, {

      logger: function logger(/*kind, msg, data*/) {
        //console.log(kind + ": " + msg, data);
      }
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

    this.chan.on("authorized", (msg) => {
      this.set("username", msg.user);
      this.set("joinedChat", true);
    });

    this.chan.on("notauthorized", function(msg) {
      alert(msg.error);
    });

    this.chan.on("user:left", (msg) => {
      if(msg.user !== null){
        let leftMessage = { user: msg.user, body: ' left the chat :dash:', timestamp: msg.timestamp };
        this.messages.pushObject(leftMessage);
      }
    });

    this.chan.on("user:authorized", (msg) => {
      let joinedMessage = { user: msg.user, body: ' joined the chat :raising_hand:', timestamp: msg.timestamp };
      this.messages.pushObject(joinedMessage);
    });


    this.chan.on("user:entered", function (/*msg*/) {
      //user entered room, but nick not authorized yet
    });

    this.chan.on("presence_state", state => {
      let presences = this.presences;
      this.set('presences', Presence.syncState(presences, state));
    });

    this.chan.on("presence_diff", diff => {
      let presences = this.presences;
      this.set('presences', Presence.syncDiff(presences, diff));
    });
  }
});
