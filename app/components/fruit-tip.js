import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class FruitTipComponent extends Component {
  @service
  eventBus;

  @action
  fruitTip(event) {
    console.log('tip fruit!');
    this.eventBus.publish('fruitTipped');
    event.preventDefault();
  }
}
