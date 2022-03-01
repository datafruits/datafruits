import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fruitTypes from '../fruit-types';
import ChatService from 'datafruits13/services/chat';

export default class FruitTipComponent extends Component {
  @service declare chat: ChatService;

  @tracked fruitTypes = fruitTypes;

  get fruitCountTotal() {
    return this.chat.getFruitCount('total');
  }

  @action
  fruitTip(fruitType: string, event: PointerEvent) {
    event.preventDefault();
    if (this.chat.token) {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitType,
        timestamp: Date.now(),
        token: this.chat.token,
      });
    } else {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitType,
        timestamp: Date.now(),
      });
    }
  }
}
