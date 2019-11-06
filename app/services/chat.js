import Service from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { Presence } from "phoenix";

export default Service.extend({
  socket: service(),
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
    let socket = this.socket.socket;

    this.chan = socket.channel("rooms:lobby", {});

    this.chan.join().receive("ignore", function () {
      //return console.log("auth error");
    }).receive("ok", function () {
      return console.log("chat join ok"); // eslint-disable-line no-console
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
