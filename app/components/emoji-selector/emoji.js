import Component from '@glimmer/component';
import emojiStrategy from '../../emojiStrategy';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class EmojiSelectorEmojiComponent extends Component {
  widthValues = {
    "S": 24,
    "M": 36,
    "L": 48,
    "XL": 60,
    "XXL": 72,
  };

  @tracked emojis = emojiStrategy;
  @tracked width = 24;

  get customEmojis() {
    return Object.values(this.emojis).filter((emoji) => {
      return emoji.custom;
    });
  }

  @action
  sizeChange(event) {
    console.log(event);
    this.width = event.target.value;
    localStorage.setItem('emojiWidth', this.width);
  }

  @action
  sendEmoji(shortname) {
    this.args.sendEmoji(shortname);
    const element = document.getElementsByClassName(shortname)[0];
    element.classList.remove('bounce');
    // https://css-tricks.com/restart-css-animation/
    void element.offsetWidth;
    element.classList.add('bounce');
  }

  @action
  didInsert() {
    this.width = parseInt(localStorage.getItem('emojiWidth'));
  }
}
