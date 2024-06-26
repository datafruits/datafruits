import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import type Fruit from '../../fruit';
import CurrentUserService from 'datafruits13/services/current-user';
import ChatService from 'datafruits13/services/chat';

interface FruitTipFruitSignature {
  Args: {
    fruit: Fruit;
    fruitTip: any;
  };
}

export default class FruitTipFruitComponent extends Component<FruitTipFruitSignature> {
  @service declare chat: ChatService;
  @service declare currentUser: CurrentUserService;
  @service declare session: any;

  get count() {
    return this.chat.getFruitCount(this.args.fruit.name);
  }

  get disabled() {
    if(this.session.isAuthenticated) {
      return (this.currentUser.user?.level < this.args.fruit.levelReq) ||
        (this.currentUser.user?.fruitTicketBalance < this.args.fruit.cost);
    } else {
      return this.args.fruit.levelReq || this.args.fruit.cost;
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'FruitTip::Fruit': typeof FruitTipFruitComponent;
  }
}

