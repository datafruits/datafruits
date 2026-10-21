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
  @service declare fastboot: any;

  @tracked presences = {};
  @tracked messages: Array<Message> = [];
  @tracked joinedChat: boolean = false;
  @tracked gifsEnabled: boolean = true;
  @tracked token: string = '';

  @tracked scrollTop: number = 0;
  @tracked isScrolledToBottom: boolean = true;
  @tracked newMessagesBelow: boolean = false;

  @tracked _fruitCounts: FruitCount = {};

  @tracked limitBreakActivated: boolean = false; // TODO
  @tracked limitBreakProgress: number = 0;

  @tracked recentEmojis: string[] = [];

  @tracked loading: boolean = true;

  username: string = '';

  chan!: Channel;
  notificationChan!: Channel;

  setFruitCount(key: string, value: number) {
    if (isDestroyed(this) || isDestroying(this)) return;
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
    this.chan.push('disconnect', { user: this.username });
    this.joinedChat = false;
  }

  push(message: string, object: any) {
    if (isDestroyed(this) || isDestroying(this)) return;
    this.chan.push(message, object);
  }

  onTrackPlayed(event: any) {
    if (isDestroyed(this) || isDestroying(this)) return;
    console.log(event);
    this.chan.push("track_playback", { track_id: event.track_id });
  }

  lockTreasure(uuid: string) {
    if (isDestroyed(this) || isDestroying(this)) return;
    const treasureMessage = this.messages.find((message) => {
      return message.uuid === uuid;
    });
    if(treasureMessage) {
      this.messages = [...this.messages.map((message) =>
        message.uuid === uuid ? { ...message, treasureLocked: true } : message
      )];
    }
  }

  openTreasure(uuid: string) {
    if (isDestroyed(this) || isDestroying(this)) return;
    const treasureMessage = this.messages.find((message) => {
      return message.uuid === uuid;
    });
    if(treasureMessage) {
      this.messages = [...this.messages.map((message) =>
        message.uuid === uuid ? { ...message, treasureLocked: true } : message
      )];
    }
  }
  
  checkScrolledToBottom(): boolean {
    if (typeof document === 'undefined') return true;
    const messages = document.getElementById('messages');
    if (!messages) return true;
    const messagesHeight = messages.getBoundingClientRect().height;
    return messages.scrollHeight - messages.scrollTop - messagesHeight < 100;
  }

  constructor() {
    super(...arguments);

    if (this.fastboot.isFastBoot) {
      return;
    }

    const socket = this.socket.socket!;

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
      .receive('timeout', function () {});

    this.chan.onError(function () {});
    this.chan.onClose(function () {});

    this.chan.on('join', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      if(msg.hype_meter_status === "active") {
        this.limitBreakActivated = true;
      }
      this.limitBreakProgress = msg.limit_break_percentage;
    });

    this.chan.on('treasure:received', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.openTreasure(msg.uuid);
    });

    this.chan.on('treasure:opened', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.lockTreasure(msg.uuid);
      if(msg.user !== this.username) return;
      const treasureChest = this.store.createRecord('treasureChest', {
        username: msg.user,
        treasureName: msg.treasure,
        amount: msg.amount,
        treasureUuid: msg.uuid,
      });
      treasureChest.save().then(() => {
        if (isDestroyed(this) || isDestroying(this)) return;
        this.chan.push("treasure:received", {
          user: msg.user,
          token: this.token,
          uuid: msg.uuid,
          treasure: msg.treasure,
          amount: msg.amount,
          double_bonus: msg.double_bonus
        });
        this.eventBus.publish("treasureOpened", msg.treasure);
        if (msg.treasure === 'fruit_tickets' && msg.amount) {
          if (this.currentUser.user) {
            this.currentUser.user.fruitTicketBalance = (this.currentUser.user.fruitTicketBalance || 0) + msg.amount;
          }
        }

        void this.currentUser.load(true);
      })
      .catch((error: any) => {
        console.log('couldnt open (save) treasure chest', error);
      });
    });

    this.chan.on('new:msg', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
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
      if (isDestroyed(this) || isDestroying(this)) return;
      this.setFruitCount("total", msg.total_count);
      this.setFruitCount(msg.fruit, msg.count);
      this.eventBus.publish("fruitTipped", msg.fruit);
    });

    this.chan.on('authorized', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.username = msg.user;
      const token = msg.token;
      if (token) {
        this.token = msg.token;
        this.currentUser
          .load()
          .then(() => {
            if (isDestroyed(this) || isDestroying(this)) return;
            this.loading = false;
            this.joinedChat = true;
          })
          .catch(() => this.session.invalidate());
      } else {
        this.loading = false;
        this.joinedChat = true;
      }
      this.recentEmojis = msg.recent_emojis;
    });

    this.chan.on('notauthorized', function (msg) {
      alert(msg.error);
    });

    this.chan.on('disconnect', (/*msg*/) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.joinedChat = false;
    });

    this.chan.on('banned', (/*msg*/) => {});

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
      if (isDestroyed(this) || isDestroying(this)) return;
      for (const [key, value] of Object.entries(counts)) {
        this.setFruitCount(key, value);
      }
    });

    this.chan.on('limit_break_increase', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.limitBreakProgress = msg.percentage;
    });

    this.chan.on('limit_break_reached', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.eventBus.publish("limitBreakReached", msg.combo);
    });

    this.chan.on('limit_break_activate', () => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.limitBreakActivated = true;
    });

    this.chan.on('limit_break_deactivate', () => {
      if (isDestroyed(this) || isDestroying(this)) return;
      this.limitBreakActivated = false;
    });

    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');

    this.notificationChan = socket.channel('user_notifications', {});

    this.notificationChan
      .join()
      .receive('ok', () => {
        if (isDestroyed(this) || isDestroying(this)) return;
      })
      .receive('timeout', function () {});

    this.notificationChan.on('new:msg', (msg) => {
      if (isDestroyed(this) || isDestroying(this)) return;
      if (this.currentUser.user) {
        msg.hasMention = msg.body.indexOf(`@${this.currentUser.user.username}`) > -1;
      }
      this.messages = [...this.messages, msg];
    });
  }

  willDestroy(): void {
    super.willDestroy();
    this.eventBus.unsubscribe('trackPlayed', this, 'onTrackPlayed');
  }
}