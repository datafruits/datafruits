import Component from '@glimmer/component';
import emojiStrategy from '../../emojiStrategy';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class EmojiSelectorEmojiComponent extends Component {
  @tracked emojis = emojiStrategy;
  @tracked width = 24;

  get customEmojis() {
    return Object.values(this.emojis).filter((emoji) => {
      return emoji.custom;
    });
  }

  @action
  sizeChange(event) {
    this.width = event.target.value;
  }
  @action
  closeDialogAndSendEmoji(shortname) {
    this.args.sendEmoji(shortname);
    this.args.closeDialog();
  }
}
