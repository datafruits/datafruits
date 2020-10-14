import Service, { inject as service } from '@ember/service';
import ArrayProxy from '@ember/array/proxy';
import { A } from '@ember/array';
import { computed } from '@ember/object';
import { Presence } from 'phoenix';

export default Service.extend({
  socket: service(),
  session: service(),
  currentUser: service(),
  joinedUsers: computed('presences', function () {
    return Object.keys(this.presences);
  }),
  messages: ArrayProxy.create({ content: A() }),
  joinedChat: false,
  gifsEnabled: true,
  token: '',
  disconnect() {
    // need to broadcast a disconnect here or it will look like user is still in the chat to everyone
    this.chan.push('disconnect', { user: this.username });
    this.set('joinedChat', false);
  },
  push(message, object) {
    this.chan.push(message, object);
  },
  init() {
    this._super(...arguments);
    this.set('presences', {});

    if (this.session.isAuthenticated) {
      this.set('joinedChat', true);
      this.set('username', this.currentUser.user.username);
      this.set('token', this.session.data.authenticated.token);
    }

    let socket = this.socket.socket;

    this.chan = socket.channel('rooms:lobby', {});

    this.chan
      .join()
      .receive('ignore', function () {
        //return console.log("auth error");
      })
      .receive('ok', function () {
        return console.log('chat join ok'); // eslint-disable-line no-console
      })
      .receive('timeout', function () {
        //return console.log("Connection interruption");
      });

    this.chan.onError(function (/*e*/) {
      //return console.log("something went wrong", e);
    });

    this.chan.onClose(function (/*e*/) {
      //return console.log("channel closed", e);
    });

    this.chan.on('new:msg', (msg) => {
      if (msg['role']) {
        msg['role'] = msg.role.split(' ');
      }
      this.messages.pushObject(msg);
    });

    this.chan.on('authorized', (msg) => {
      this.set('username', msg.user);
      const token = msg.token;
      if (token) {
        this.set('token', msg.token);
        // load currentUser
        this.currentUser
          .load()
          .then(() => {
            console.log('user authorized with token');
            this.set('joinedChat', true);
          })
          .catch(() => this.session.invalidate());
      } else {
        console.log('user authorized');
        this.set('joinedChat', true);
      }
      // fetch currentUser here? ???
    });

    this.chan.on('notauthorized', function (msg) {
      alert(msg.error);
    });

    this.chan.on('user:left', (msg) => {
      if (msg.user !== null) {
        let leftMessage = { user: msg.user, body: ' left the chat :dash:', timestamp: msg.timestamp };
        this.messages.pushObject(leftMessage);
      }
    });

    this.chan.on('user:authorized', (msg) => {
      let joinedMessage = { user: msg.user, body: ' joined the chat :raising_hand:', timestamp: msg.timestamp };
      this.messages.pushObject(joinedMessage);
    });

    // user banned
    this.chan.on('disconnect', (/*msg*/) => {
      this.set('joinedChat', false);
    });

    this.chan.on('banned', (msg) => {
      console.log(`user banned:`);
      console.log(msg);
    });

    this.chan.on('presence_state', (state) => {
      let presences = this.presences;
      this.set('presences', Presence.syncState(presences, state));
    });

    this.chan.on('presence_diff', (diff) => {
      let presences = this.presences;
      this.set('presences', Presence.syncDiff(presences, diff));
    });
  },
});
