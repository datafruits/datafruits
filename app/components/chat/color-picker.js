import Component from "@glimmer/component";
import { action } from "@ember/object";
import { oneWay } from "@ember/object/computed";
import { inject as service } from "@ember/service";

export default class ColorPicker extends Component {
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
