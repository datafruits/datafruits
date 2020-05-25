import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ColorTextSelector extends Component {
  @service
  chatText

  @action
  selectedColor(event) {
    this.chatText.setColor(event.target.value)
  }
}
