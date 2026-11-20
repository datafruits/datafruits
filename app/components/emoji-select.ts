import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';
import EmojiService from 'datafruits13/services/emoji';

interface EmojiSelectArgs {
  changeset?: BufferedChangeset;
  value?: string;
  onChange?: (emoji: string) => void;
}

export default class EmojiSelect extends Component<EmojiSelectArgs> {
  @service declare emoji: EmojiService;

  @action
  selectEmoji(emoji: { shortname: string }) {
    if (this.args.onChange) {
      this.args.onChange(emoji.shortname);
    } else {
      this.args.changeset?.set('emoji', emoji.shortname);
    }
  }

  get selectedEmoji() {
    const shortname = this.args.value ?? this.args.changeset?.get('emoji');
    return this.emojiOptions.find(emoji => emoji.shortname === shortname);
  }

  get emojiOptions() {
    if (!this.emoji.isLoaded) {
      return [];
    }

    const manifest = this.emoji.manifest || [];
    return manifest.map((emoji) => ({
      shortname: `:${emoji.name}:`,
      file: emoji.file,
      url: this.emoji.urlFor(emoji.name),
      custom: true,
      animated: emoji.file?.endsWith('.gif') || false,
    }));
  }
}
