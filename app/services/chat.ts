import Service, { inject as service } from '@ember/service';
import { Presence, Channel } from 'phoenix';
import { isDestroying, isDestroyed } from '@ember/destroyable';
import { tracked } from '@glimmer/tracking';
import SocketService from 'datafruits13/services/socket';
import EventBusService from 'datafruits13/services/event-bus';
import CurrentUserService from 'datafruits13/services/current-user';
import type User from 'datafruits13/models/user';

interface FruitCount {
  [key: string]: number;
}

interface ComboDefinition {
  name: string;
  condition: (_counts: FruitCount) => boolean;
  cooldownSeconds: number;
}

const FREE_FRUITS = ['strawberry', 'orange', 'lemon', 'banana', 'watermelon', 'cabbage', 'beamsprout'];
const PREMIUM_FRUITS = ['metal-pineapple', 'real-lemoner', 'mega-beamsprout', 'giga-shrimpshake', 'the-ravers'];

const COMBO_DEFINITIONS: ComboDefinition[] = [
  {
    name: 'citrus-storm',
    condition: (counts) => (counts['lemon'] || 0) >= 5 && (counts['orange'] || 0) >= 5,
    cooldownSeconds: 60,
  },
  {
    name: 'tropical-wave',
    condition: (counts) => (counts['banana'] || 0) >= 5 && (counts['pineapple'] || 0) >= 5,
    cooldownSeconds: 60,
  },
  {
    name: 'berry-blast',
    condition: (counts) => (counts['strawberry'] || 0) >= 10,
    cooldownSeconds: 60,
  },
  {
    name: 'rainbow-mix',
    condition: (counts) => FREE_FRUITS.filter((f) => (counts[f] || 0) >= 2).length >= 5,
    cooldownSeconds: 90,
  },
  {
    name: 'fruit-overflow',
    condition: (counts) => (counts['total'] || 0) >= 50,
    cooldownSeconds: 120,
  },
  {
    name: 'mega-combo',
    condition: (counts) => PREMIUM_FRUITS.filter((f) => (counts[f] || 0) >= 1).length >= 3,
    cooldownSeconds: 180,
  },
];

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

export default class ChatService extends Service {
  @service declare socket: SocketService;
  @service declare session: any;
  @service declare eventBus: EventBusService;
  @service declare currentUser: CurrentUserService;
  @service declare store: any;

  @tracked presences = {};
  @tracked messages: Array<Message> = [];
  @tracked joinedChat: boolean = false;
  @tracked gifsEnabled: boolean = true;
  @tracked token: string = '';

  @tracked isScrolledToBottom: boolean = true;

  @tracked _fruitCounts: FruitCount = {};

  @tracked limitBreakActivated: boolean = false; // TODO
  @tracked limitBreakProgress: number = 0;

  @tracked recentEmojis: string[] = [];

  @tracked loading: boolean = true;

  @tracked scrollTop: number = 0;

  username: string = '';

  chan: Channel;
  notificationChan: Channel;

  lastComboTimes: Map<string, number> = new Map();

  setFruitCount(key: string, value: number) {
    this._fruitCounts[key] = value;
    this._fruitCounts = { ...this._fruitCounts };
  }

  getFruitCount(key: string) {
    return this._fruitCounts[key];
  }

  checkCombos() {
    const now = Date.now();
    const eligible = COMBO_DEFINITIONS.filter((combo) => {
      if (!combo.condition(this._fruitCounts)) return false;
      const lastTime = this.lastComboTimes.get(combo.name) || 0;
      return now - lastTime >= combo.cooldownSeconds * 1000;
    });
    if (eligible.length === 0) return;
    const chosen = eligible[Math.floor(Math.random() * eligible.length)];
    this.lastComboTimes.set(chosen.name, now);
    this.eventBus.publish('comboTriggered', chosen.name);
  }

  join(username: string, token: string) {
    this.joinedChat = true;
    this.username = username;
    this.token = token;
  }

  joinAndAuthorize(user: User, token: string) {
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
    // need to broadcast a disconnect here or it will look like user is still in the chat to everyone
    this.chan.push('disconnect', { user: this.username });
    this.joinedChat = false;
  }

  push(message: string, object: any) {
    this.chan.push(message, object);
  }

  onTrackPlayed(event: any) {
    console.log(event);
    this.chan.push("track_playback", { track_id: event.track_id });
  }

  lockTreasure(uuid: string) {
    console.log('locking treasure with uuid: ', uuid);
    const treasureMessage = this.messages.find((message) => {
      return message.uuid === uuid;
    });
    if(treasureMessage) {
      console.log('found message with the uuid: ', treasureMessage);
      // reassign messages so ember updates it
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
    if(treasureMessage) {
      console.log('found message with the uuid: ', treasureMessage);
      // reassign messages so ember updates it
      this.messages = [...this.messages.map((message) =>
        message.uuid === uuid ? { ...message, treasureLocked: true } : message
      )];
    }
  }

  constructor() {
    super(...arguments);

    const socket = this.socket.socket;

    this.chan = socket.channel('rooms:lobby', {});

    this.chan
      .join()
      .receive('ok', () => {
        if (isDestroyed(this) || isDestroying(this)) return;
        if (this.session.isAuthenticated && this.currentUser.user) {
          console.log('join and authorized ok');
          this.joinAndAuthorize(this.currentUser.user, this.session.data.authenticated.token);
        } else {
          this.loading = false;
          return console.log('chat join ok');
        }
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

    this.chan.on('join', (msg) => {
      console.log('on join: ', msg);
      if(msg.hype_meter_status === "active") {
        this.limitBreakActivated = true;
      }
      this.limitBreakProgress = msg.limit_break_percentage;
    });

    this.chan.on('treasure:received', (msg) => {
      console.log('treasure_received: ', msg);
      this.openTreasure(msg.uuid);
    });

    this.chan.on('treasure:opened', (msg) => {
      this.lockTreasure(msg.uuid);
      if(msg.user !== this.username) return;
      console.log('got treasure:opened ', msg);
      const treasureChest = this.store.createRecord('treasureChest', {
        username: msg.user,
        treasureName: msg.treasure,
        amount: msg.amount,
        treasureUuid: msg.uuid,
      });
      treasureChest.save().then(() => {
        console.log('sending treasure:received');
        this.chan.push("treasure:received", {
          user: msg.user,
          token: this.token,
          uuid: msg.uuid,
          treasure: msg.treasure,
          amount: msg.amount,
          double_bonus: msg.double_bonus
        });
        this.eventBus.publish("treasureOpened", msg.treasure);
        // update user balance
        if (msg.treasure === 'fruit_tickets' && msg.amount) {
          if (this.currentUser.user) {
            this.currentUser.user.fruitTicketBalance = (this.currentUser.user.fruitTicketBalance || 0) + msg.amount;
          }
        }

        void this.currentUser.load(true);
      })
      .catch((error: any) => {
        console.log('couldnt open (save) treasure chest');
        console.log(error);
        //  TODO unlock treasure in fail case
      });
    });

    this.chan.on('new:msg', (msg) => {
      console.log("new:msg", msg);
      if (msg['role']) {
        msg['role'] = msg.role.split(' ');
      }
      if (this.currentUser.user) {
        msg.hasMention = msg.body.indexOf(`@${this.currentUser.user.username}`) > -1;
      }
      if(msg.uuid) {
        const uuids = this.messages.map(m => { return m.uuid; });
        if(uuids.includes(msg.uuid)) return;
      }
      this.messages = [...this.messages, msg];
    });

    this.chan.on('new:fruit_tip', (msg) => {
      // log fruit tip data { count: ..., }
      console.log(msg);
      this.setFruitCount("total", msg.total_count);
      this.setFruitCount(msg.fruit, msg.count);
      this.checkCombos();
      this.eventBus.publish("fruitTipped", msg.fruit);
    });

    this.chan.on('authorized', (msg) => {
      this.username = msg.user;
      console.log('user authorized msg: ', msg);
      const token = msg.token;
      if (token) {
        this.token = msg.token;
        // load currentUser
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
      // fetch currentUser here? ???
    });

    this.chan.on('notauthorized', function (msg) {
      alert(msg.error);
    });

    // user banned
    this.chan.on('disconnect', (/*msg*/) => {
      this.joinedChat = false;
    });

    this.chan.on('banned', (msg) => {
      console.log(`user banned:`);
      console.log(msg);
    });

    this.chan.on('presence_state', (state) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      const presences = this.presences;
      this.presences = Presence.syncState(presences, state);
    });

    this.chan.on('presence_diff', (diff) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      const presences = this.presences;
      this.presences = Presence.syncDiff(presences, diff);
    });

    this.chan.on('fruit_counts', (counts: FruitCount) => {
      for (const [key, value] of Object.entries(counts)) {
        this.setFruitCount(key, value);
      }
    });

    this.chan.on('limit_break_increase', (msg) => {
      console.log('limit break increased!: ', msg);
      this.limitBreakProgress = msg.percentage;
    });

    this.chan.on('limit_break_reached', (msg) => {
      console.log('limit break reached!: ', msg);
      this.eventBus.publish("limitBreakReached", msg.combo);
    });

    this.chan.on('limit_break_activate', () => {
      console.log('limit break activated!');
      this.limitBreakActivated = true;
    });
    //
    this.chan.on('limit_break_deactivate', () => {
      console.log('limit break deactivated!');
      this.limitBreakActivated = false;
    });

    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');

    this.notificationChan = socket.channel('user_notifications', {});

    this.notificationChan
      .join()
      .receive('ok', () => {
        if (isDestroyed(this) || isDestroying(this)) return;
          return console.log('notification chan join ok');
      })
      .receive('timeout', function () {
        //return console.log("Connection interruption");
      });

    this.notificationChan.on('new:msg', (msg) => {
      if (this.currentUser.user) {
        msg.hasMention = msg.body.indexOf(`@${this.currentUser.user.username}`) > -1;
      }
      this.messages = [...this.messages, msg];
    });

  }

  willDestroy(): void {
    console.log('chat willDestroy');
    super.willDestroy();
    this.eventBus.unsubscribe('trackPlayed', this, 'onTrackPlayed');
  }
}
