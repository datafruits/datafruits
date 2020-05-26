import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ColorTextSelector extends Component {
  @tracked style = "color: yellow";

  @service 
  chatText;

  @action
  selectedColor(event) {
    this.style = "color: " + event.target.value;
    this.chatText.setColor(event.target.value);
  }
}
