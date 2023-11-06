import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ChatMessage extends Component {
  @tracked gifsEnabled = true;
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
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChatMessage: typeof ChatMessage;
  }
}

