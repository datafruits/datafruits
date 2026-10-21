import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import EmojiZoneService from 'datafruits13/services/emoji-zone';
import { BufferedChangeset } from 'ember-changeset/types';

interface EmojiSelectArgs {
  changeset: BufferedChangeset;
}

export default class EmojiSelect extends Component<EmojiSelectArgs> {
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  @action
  selectEmoji(emoji: { shortname: string }) {
    this.args.changeset.set('emoji', emoji.shortname);
  }

  get emojiOptions() {
    // Rely on the tracked emojiZone service state so it updates reactively upon load
    if (!this.emojiZone.isLoaded) {
      return [];
    }

    const manifest = this.emojiZone.manifest || [];
    return manifest.map((emoji) => ({
      shortname: `:${emoji.name}:`,
      file: emoji.file,
      url: this.emojiZone.urlFor(emoji.name),
      custom: true,
      animated: emoji.file?.endsWith('.gif') || false,
    }));
  }
}