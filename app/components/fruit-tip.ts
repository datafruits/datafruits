import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fruitTypes from '../fruit-types';
import ChatService from 'datafruits13/services/chat';
import CurrentUserService from 'datafruits13/services/current-user';
import type Fruit from '../fruit';

export default class FruitTipComponent extends Component {
  @service declare chat: ChatService;
  @service declare store: any;
  @service declare currentUser: CurrentUserService;

  @tracked fruitTypes = fruitTypes;

  get fruitCountTotal() {
    return this.chat.getFruitCount('total');
  }

  _pushFruitTip(fruitName: string) {
    if (this.chat.token) {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitName,
        timestamp: Date.now(),
        token: this.chat.token,
      });
    } else {
      this.chat.push('new:fruit_tip', {
        user: this.chat.username,
        fruit: fruitName,
        timestamp: Date.now(),
      });
    }
  }

  @action
  async fruitTip(fruit: Fruit, event: PointerEvent) {
    event.preventDefault();
    if (fruit.cost > 0) {
      const result = confirm(`This fruit summon will cost Ƒ${fruit.cost} fruit tickets. Are you sure you want to blow your hard earned cash?`);
      if (result) {
        const fruitSummon = this.store.createRecord('fruit-summon', { name: fruit.name });
        try {
          await fruitSummon.save();
          // reload current user to get new balance
          await this.currentUser.load(true);
          this._pushFruitTip(fruit.name);
        } catch (error) {
          alert('couldnt do fruit summon!');
          console.log(error);
        }
      }
    } else {
      this._pushFruitTip(fruit.name);
    }
  }
}
