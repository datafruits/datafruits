import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChatMessage extends Component {
  @tracked gifsEnabled = true;
  @service chat;
  @service currentUser;
  @service session;
  @service intl;

  imgRegex = /https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|jpeg|gif|png|webp)(\?.*$)*/i;
  dataRegex = /data:image\/.+;base64,.+/;
  discordRegex = /^New\ msg\ in\ discord\ from\ (.+):\ (.+)$/; // eslint-disable-line no-useless-escape

  get canShowAvatar() {
    if (!this.args.message.role) return false;
    return (
      this.args.message.role.includes('dj') ||
      this.args.message.role.includes('admin') ||
      this.args.message.role.includes('listener') ||
      this.args.message.role.includes('bot')
    );
  }

  get hasImage() {
    return this.imgRegex.test(this.args.message.body);
  }

  get hasData() {
    return this.dataRegex.test(this.args.message.body);
  }

  get hasImageData() {
    return this.hasImage || this.hasData;
  }

  get imgUrl() {
    if (this.hasImage)
      return this.args.message.body.match(this.imgRegex)[0];

    if (this.hasData)
      return this.args.message.body.match(this.dataRegex)[0];

    return ""
  }

  get messageText() {
    var body = this.args.message.body;

    if (this.hasImage) {
      body = this.args.message.body.replace(this.imgRegex, "");
    }
    if (this.hasData) {
      body = this.args.message.body.replace(this.dataRegex, "");
    }

    return body;
  }

  get fromDiscord() {
    return this.discordRegex.test(this.args.message.body) && this.args.message.user == "coach";
  }

  get discordUser() {
    return this.args.message.body.match(this.discordRegex)[1];
  }

  get discordMsg() {
    return this.args.message.body.match(this.discordRegex)[2];
  }

  @action
  setScrolling() {
    this.args.setupAutoscroll();
    this.args.adjustScrolling();
  }

  @action
  grabTreasure() {
    if(this.session.isAuthenticated) {
      console.log('grabbing treasure...');
      // send treasure:open to chat
      // we'll need to send a token...
      this.chat.push("treasure:open", {
        user: this.currentUser.user.username,
        token: this.chat.token,
        treasure: this.args.message.treasure,
        amount: this.args.message.amount,
        uuid: this.args.message.uuid,
        double_bonus: this.args.message.double_bonus,
        timestamp: Date.now(),
      });
    } else {
      alert("you need to login to open treasure!");
    }
  }

  get cantOpenTreasure() {
    return this.args.message.treasureLocked || this.args.message.treasureOpened;
  }
}
