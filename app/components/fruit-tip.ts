import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fruitTypes from '../fruit-types';
import ChatService from 'datafruits13/services/chat';
import CurrentUserService from 'datafruits13/services/current-user';
import type Fruit from '../fruit';

interface FruitTipPayload {
  user: string
  fruit: string
  timestamp: number
  token?: string
  isFruitSummon?: boolean
  cost?: number
}

export default class FruitTipComponent extends Component {
  @service declare chat: ChatService;
  @service declare store: any;
  @service declare currentUser: CurrentUserService;
  @service declare session: any;

  @tracked fruitTypes = fruitTypes;
  @tracked isPaidFruitSummonInProgress = false;

  get fruitCountTotal() {
    return this.chat.getFruitCount('total');
  }

  _pushFruitTip(fruitName: string, isFruitSummon: boolean = false, cost?: number) {
    const payload: FruitTipPayload = {
        user: this.chat.username,
        fruit: fruitName,
        timestamp: Date.now(),
    };
    if (this.chat.token) {
        payload.token = this.chat.token;
    }
    if(isFruitSummon) {
      payload.isFruitSummon = true;
      payload.cost = cost;
    }
    this.chat.push('new:fruit_tip', payload);
  }

  @action
  async fruitTip(fruit: Fruit, event: PointerEvent) {
    event.preventDefault();
    if (fruit.cost > 0) {
      // Prevent multiple concurrent paid fruit summons
      if (this.isPaidFruitSummonInProgress) {
        return;
      }
      
      const result = confirm(`This fruit summon will cost Ƒ${fruit.cost} fruit tickets. Are you sure you want to blow your hard earned cash?`);
      if (result) {
        this.isPaidFruitSummonInProgress = true;
        const fruitSummon = this.store.createRecord('fruit-summon', { name: fruit.name });
        try {
          await fruitSummon.save();
          // reload current user to get new balance
          await this.currentUser.load(true);
          this._pushFruitTip(fruit.name, true, fruit.cost);
        } catch (error) {
          alert('couldnt do fruit summon!');
          console.log(error);
        } finally {
          this.isPaidFruitSummonInProgress = false;
        }
      }
    } else {
      this._pushFruitTip(fruit.name);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FruitTipComponent: typeof FruitTipComponent;
  }
}
