import Component from '@glimmer/component';
import { action } from '@ember/object';
import emojiStrategy from 'datafruits13/emojiStrategy';
import { BufferedChangeset } from 'ember-changeset/types';

interface EmojiSelectArgs {
  changeset: BufferedChangeset;
}

export default class EmojiSelect extends Component<EmojiSelectArgs> {
  @action
  selectEmoji(emoji: string) {
    this.args.changeset.set('emoji', emoji);
  }

  get emojiOptions() {
    return Object.values(emojiStrategy).filter((emoji) => {
      return emoji.custom;
    });
  }
}
