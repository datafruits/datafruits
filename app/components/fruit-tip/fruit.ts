import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Fruit from '../../fruit';
import CurrentUserService from 'datafruits13/services/current-user';
import ChatService from 'datafruits13/services/chat';

interface FruitTipFruitComponentArgs {
  fruit: Fruit;
  cost: number;
  fruitTip: any;
}

export default class FruitTipFruitComponent extends Component<FruitTipFruitComponentArgs> {
  @service declare chat: ChatService;
  @service declare currentUser: CurrentUserService;
  @service declare session: any;

  get count() {
    return this.chat.getFruitCount(this.args.fruit.name);
  }

  get disabled() {
    return (this.currentUser.user?.level < this.args.fruit.levelReq) ||
      (this.currentUser.user?.fruitTicketBalance < this.args.fruit.cost) ||
      (!this.session.isAuthenticated);
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FruitTipFruitComponent: typeof FruitTipFruitComponent;
  }
}
  
