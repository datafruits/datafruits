import Component from '@glimmer/component';
import type Store from '@ember-data/store';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import type Owner from '@ember/owner';
import FruitTicketGiftValidations from '../validations/fruit-ticket-gift';
import type FruitTicketGift from 'datafruits13/models/fruit-ticket-gift';
import type User from 'datafruits13/models/user';

interface GiftUserFruitTixArgs {
  toUser: User;
}

export default class GiftUserFruitTix extends Component<GiftUserFruitTixArgs> {
  FruitTicketGiftValidations = FruitTicketGiftValidations;

  @tracked showingModal: boolean = false;
  @tracked fruitTicketGift: FruitTicketGift;
  @service declare store: Store;
  @service declare currentUser: any;

  constructor(owner: Owner, args: GiftUserFruitTixArgs) {
    super(owner, args);
    this.fruitTicketGift = this.store.createRecord('fruit-ticket-gift', {
      toUserId: this.args.toUser.id
    });
  }

  willDestroy(): void {
    super.willDestroy();
    if (this.fruitTicketGift.isNew) {
      this.fruitTicketGift.unloadRecord();
    }
  }

  @action
  showFruitTixModal() {
    this.showingModal = !this.showingModal;
  }

  @action
  onSubmit(result: any, event: any) {
    console.log(result);
    console.log(event);
    this.currentUser.load().then(() => {
      alert('successsssss!');
    });
  }

  @action
  onError(error: any) {
    console.log('error giving fruit tix: ', error);
    alert('couldnt give fruit tix :(!');
  }
}
