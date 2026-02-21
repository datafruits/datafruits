import { BaseService, service, tracked } from '../../framework/index.js';
import { Presence, Channel } from 'phoenix';

interface FruitCount {
  [key: string]: number;
}

interface Message {
  user: string;
  avatarUrl: string;
  role: string;
  uuid: string | null;
  treasure: string | null;
  treasureAmount: number | null;
  treasureLocked: boolean;
  treasureOpened: boolean;
}

export default class ChatService extends BaseService {
  @service('socket') declare socket: any;
  @service('session') declare session: any;
  @service('eventBus') declare eventBus: any;
  @service('currentUser') declare currentUser: any;
  @service('store') declare store: any;

  @tracked presences = {};
  @tracked messages: Array<Message> = [];
  @tracked joinedChat: boolean = false;
  @tracked gifsEnabled: boolean = true;
  @tracked token: string = '';

  @tracked isScrolledToBottom: boolean = true;

  @tracked _fruitCounts: FruitCount = {};

  @tracked limitBreakActivated: boolean = false;
  @tracked limitBreakProgress: number = 0;

  @tracked recentEmojis: string[] = [];

  @tracked loading: boolean = true;

  @tracked scrollTop: number = 0;

  username: string = '';

  chan: Channel;
  notificationChan: Channel;

  _destroyed: boolean = false;

  setFruitCount(key: string, value: number) {
    this._fruitCounts[key] = value;
    this._fruitCounts = { ...this._fruitCounts };
  }

  getFruitCount(key: string) {
    return this._fruitCounts[key];
  }

  join(username: string, token: string) {
    this.joinedChat = true;
    this.username = username;
    this.token = token;
  }

  joinAndAuthorize(user: any, token: string) {
    this.joinedChat = true;
    this.username = user.username;
    this.token = token;

    const avatarUrl = user.avatarUrl;
    const role = user.role;
    const style = user.style;
    const pronouns = user.pronouns;
    this.push('authorize_token', {
      user: user.username,
      timestamp: Date.now(),
      token: token,
      avatarUrl,
      role,
      style,
      pronouns,
    });
  }

  disconnect() {
    this.chan.push('disconnect', { user: this.username });
    this.joinedChat = false;
  }

  push(message: string, object: any) {
    this.chan.push(message, object);
  }

  onTrackPlayed(event: any) {
    console.log(event);
    this.chan.push('track_playback', { track_id: event.track_id });
  }

  lockTreasure(uuid: string) {
    console.log('locking treasure with uuid: ', uuid);
    const treasureMessage = this.messages.find((message) => {
      return message.uuid === uuid;
    });
    if (treasureMessage) {
      this.messages = [...this.messages.map((message) =>
        message.uuid === uuid ? { ...message, treasureLocked: true } : message
      )];
    }
  }

  openTreasure(uuid: string) {
    console.log('open treasure with uuid: ', uuid);
    const treasureMessage = this.messages.find((message) => {
      return message.uuid === uuid;
    });
    if (treasureMessage) {
      this.messages = [...this.messages.map((message) =>
        message.uuid === uuid ? { ...message, treasureLocked: true } : message
      )];
    }
  }

  constructor() {
    super();

    const socket = this.socket.socket;

    this.chan = socket.channel('rooms:lobby', {});

    this.chan
      .join()
      .receive('ok', () => {
        if (this._destroyed) return;
        if (this.session.isAuthenticated && this.currentUser.user) {
          console.log('join and authorized ok');
          this.joinAndAuthorize(this.currentUser.user, this.session.data.authenticated.token);
        } else {
          this.loading = false;
          return console.log('chat join ok');
        }
      })
      .receive('timeout', function () {});

    this.chan.onError(function () {});
    this.chan.onClose(function () {});

    this.chan.on('join', (msg: any) => {
      console.log('on join: ', msg);
      if (msg.hype_meter_status === 'active') {
        this.limitBreakActivated = true;
      }
      this.limitBreakProgress = msg.limit_break_percentage;
    });

    this.chan.on('treasure:received', (msg: any) => {
      console.log('treasure_received: ', msg);
      this.openTreasure(msg.uuid);
    });

    this.chan.on('treasure:opened', (msg: any) => {
      this.lockTreasure(msg.uuid);
      if (msg.user !== this.username) return;
      console.log('got treasure:opened ', msg);
      const treasureChest = this.store.createRecord('treasureChest', {
        username: msg.user,
        treasureName: msg.treasure,
        amount: msg.amount,
        treasureUuid: msg.uuid,
      });
      this.store.saveRecord(treasureChest).then(() => {
        console.log('sending treasure:received');
        this.chan.push('treasure:received', {
          user: msg.user,
          token: this.token,
          uuid: msg.uuid,
          treasure: msg.treasure,
          amount: msg.amount,
          double_bonus: msg.double_bonus
        });
        this.eventBus.publish('treasureOpened', msg.treasure);
      })
      .catch((error: any) => {
        console.log('couldnt open (save) treasure chest');
        console.log(error);
      });
    });

    this.chan.on('new:msg', (msg: any) => {
      console.log('new:msg', msg);
      if (msg['role']) {
        msg['role'] = msg.role.split(' ');
      }
      if (this.currentUser.user) {
        msg.hasMention = msg.body.indexOf(`@${this.currentUser.user.username}`) > -1;
      }
      if (msg.uuid) {
        const uuids = this.messages.map((m: any) => { return m.uuid; });
        if (uuids.includes(msg.uuid)) return;
      }
      this.messages = [...this.messages, msg];
    });

    this.chan.on('new:fruit_tip', (msg: any) => {
      console.log(msg);
      this.setFruitCount('total', msg.total_count);
      this.setFruitCount(msg.fruit, msg.count);
      this.eventBus.publish('fruitTipped', msg.fruit);
    });

    this.chan.on('authorized', (msg: any) => {
      this.username = msg.user;
      console.log('user authorized msg: ', msg);
      const token = msg.token;
      if (token) {
        this.token = msg.token;
        this.currentUser
          .load()
          .then(() => {
            console.log('user authorized with token');
            this.loading = false;
            this.joinedChat = true;
          })
          .catch(() => this.session.invalidate());
      } else {
        console.log('user authorized');
        this.loading = false;
        this.joinedChat = true;
      }
      this.recentEmojis = msg.recent_emojis;
      console.log('recentEmojis: ', this.recentEmojis);
    });

    this.chan.on('notauthorized', function (msg: any) {
      alert(msg.error);
    });

    this.chan.on('disconnect', () => {
      this.joinedChat = false;
    });

    this.chan.on('banned', (msg: any) => {
      console.log(`user banned:`);
      console.log(msg);
    });

    this.chan.on('presence_state', (state: any) => {
      if (this._destroyed) return;
      const presences = this.presences;
      this.presences = Presence.syncState(presences, state);
    });

    this.chan.on('presence_diff', (diff: any) => {
      if (this._destroyed) return;
      const presences = this.presences;
      this.presences = Presence.syncDiff(presences, diff);
    });

    this.chan.on('fruit_counts', (counts: FruitCount) => {
      for (const [key, value] of Object.entries(counts)) {
        this.setFruitCount(key, value);
      }
    });

    this.chan.on('limit_break_increase', (msg: any) => {
      console.log('limit break increased!: ', msg);
      this.limitBreakProgress = msg.percentage;
    });

    this.chan.on('limit_break_reached', (msg: any) => {
      console.log('limit break reached!: ', msg);
      this.eventBus.publish('limitBreakReached', msg.combo);
    });

    this.chan.on('limit_break_activate', () => {
      console.log('limit break activated!');
      this.limitBreakActivated = true;
    });

    this.chan.on('limit_break_deactivate', () => {
      console.log('limit break deactivated!');
      this.limitBreakActivated = false;
    });

    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');

    this.notificationChan = socket.channel('user_notifications', {});

    this.notificationChan
      .join()
      .receive('ok', () => {
        if (this._destroyed) return;
        return console.log('notification chan join ok');
      })
      .receive('timeout', function () {});

    this.notificationChan.on('new:msg', (msg: any) => {
      if (this.currentUser.user) {
        msg.hasMention = msg.body.indexOf(`@${this.currentUser.user.username}`) > -1;
      }
      this.messages = [...this.messages, msg];
    });
  }

  willDestroy(): void {
    console.log('chat willDestroy');
    this._destroyed = true;
    this.eventBus.unsubscribe('trackPlayed', this, 'onTrackPlayed');
  }
}
