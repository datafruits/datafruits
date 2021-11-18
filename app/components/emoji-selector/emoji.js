import Component from '@glimmer/component';
import emojiStrategy from '../../emojiStrategy';
import { tracked } from '@glimmer/tracking';

export default class EmojiSelectorEmojiComponent extends Component {
  @tracked emojis = emojiStrategy;
}
