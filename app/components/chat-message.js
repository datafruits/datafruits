import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ChatMessage extends Component {
  @tracked gifsEnabled = true;
  @tracked imgRegex = /https?:\/\/(?:[a-z0-9-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|gif|png|webp)(\?.*$)*/;

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

  get imgUrl() {
    return this.args.message.body.match(this.imgRegex)[0];
  }

  @action
  setScrolling() {
    this.args.setupAutoscroll();
    this.args.adjustScrolling();
  }
}
