import Component from '@glimmer/component';
import emojiStrategy from '../../emojiStrategy';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import { on } from "@ember/modifier";
import { fn } from "@ember/helper";
import emojiUrl from "../../helpers/emoji-url.js";

export default class EmojiSelectorEmojiComponent extends Component {<template><div class="flex flex-wrap justify-evenly" {{didInsert this.didInsert}}>
  <input {{on "change" this.sizeChange}} type="range" name="size" id="size" list="emoji-width-datalist" step="12" min="24" max="72" value={{this.width}}>
  <datalist id="emoji-width-datalist">
    {{#each-in this.widthValues as |label value|}}
      <option value={{value}} label={{label}}></option>
    {{/each-in}}
  </datalist>
</div>
{{#each this.customEmojis as |emoji|}}
  <button type="button" {{on "click" (fn this.sendEmoji emoji.shortname)}}>
    <img class={{emoji.shortname}} width={{this.width}} alt={{emoji.shortname}} src={{emojiUrl emoji}} />
  </button>
{{/each}}</template>
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
