import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';
import EmojiService from 'datafruits13/services/emoji';

interface EmojiSelectArgs {
  changeset: BufferedChangeset;
}

export default class EmojiSelect extends Component<EmojiSelectArgs> {
  @service declare emoji: EmojiService;

  @action
  selectEmoji(emoji: { shortname: string }) {
    this.args.changeset.set('emoji', emoji.shortname);
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