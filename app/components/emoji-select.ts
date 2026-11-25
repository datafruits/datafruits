import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { BufferedChangeset } from 'ember-changeset/types';
import EmojiService from 'datafruits13/services/emoji';

const MAX_RESULTS = 10;

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
    return this.emojiOptions.find((emoji) => emoji.shortname === shortname);
  }

  private cachedCatalog?: {
    manifest: EmojiService['manifest'];
    options: { shortname: string; url: string }[];
    initialOptions: { shortname: string; url: string }[];
  };

  private optionsFor(manifest: EmojiService['manifest']) {
    if (this.cachedCatalog?.manifest !== manifest) {
      const options = manifest.map(({ name }) => ({
        shortname: `:${name}:`,
        url: this.emoji.urlFor(name),
      }));
      this.cachedCatalog = { manifest, options, initialOptions: options.slice(0, MAX_RESULTS) };
    }

    return this.cachedCatalog;
  }

  get emojiOptions() {
    return this.optionsFor(this.emoji.manifest).options;
  }

  get initialOptions() {
    return this.optionsFor(this.emoji.manifest).initialOptions;
  }

  @action
  searchEmoji(term: string) {
    const query = term.toLowerCase();

    return this.emojiOptions
      .filter(({ shortname }) => shortname.toLowerCase().includes(query))
      .slice(0, MAX_RESULTS);
  }
}
