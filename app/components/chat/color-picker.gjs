import Component from "@glimmer/component";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import t from "ember-intl/helpers/t";
import { on } from "@ember/modifier";

export default class ColorPicker extends Component {<template><label id="chat-text-color-picker-label" for="chat-text-color-picker">
  {{t "chat.settings.chat_color"}}
</label>
<input id="chat-text-color-picker" name="chat-text-color-picker" type="color" value={{this.hexValue}} {{on "input" this.selectedColor}}></template>
  get style() {
    return this.chatText.color;
  }

  get hexValue() {
    return `#${this.style.split("#")[1]}`;
  }

  @service chatText;

  @action
  selectedColor(event) {
    if (event.target.value) {
      this.chatText.setColor(event.target.value);
      localStorage.setItem("datafruits-chat-color", event.target.value);
    }
  }
}
