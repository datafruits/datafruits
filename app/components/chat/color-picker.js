import Component from "@glimmer/component";
import { action } from "@ember/object";
import { oneWay } from "@ember/object/computed";
import { inject as service } from "@ember/service";

export default class ColorPicker extends Component {
  @oneWay("chatText.color") style;

  @service
  chatText;

  @action
  selectedColor(event) {
    this.chatText.setColor(event.target.value);
  }
}
