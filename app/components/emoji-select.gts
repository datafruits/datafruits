import Component from '@glimmer/component';
import { action } from '@ember/object';
import emojiStrategy from 'datafruits13/emojiStrategy';
import { BufferedChangeset } from 'ember-changeset/types';
import t from "ember-intl/helpers/t";
import PowerSelect from "ember-power-select/components/power-select";
import emojiUrl from "../helpers/emoji-url.js";

interface EmojiSelectArgs {
  changeset: BufferedChangeset;
}

export default class EmojiSelect extends Component<EmojiSelectArgs> {<template><label>{{t "shrimpo.form.voting_emoji"}}</label>
<PowerSelect @searchEnabled={{true}} @options={{this.emojiOptions}} @renderInPlace={{true}} @selected={{@changeset.emoji}} @searchField="shortname" @onChange={{this.selectEmoji}} as |emoji|>
  <img class="inline" width="48" alt={{emoji.shortname}} src={{emojiUrl emoji}} />
  {{emoji.shortname}}
</PowerSelect></template>
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
