import Component from '@glimmer/component';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import FruitTicketGiftValidations from '../validations/fruit-ticket-gift';
import type FruitTicketGift from 'datafruits13/models/fruit-ticket-gift';

//interface GiftUserFruitTixArgs {}

export default class GiftUserFruitTix extends Component {
  FruitTicketGiftValidations = FruitTicketGiftValidations;

  @tracked showingModal: boolean = false;
  @tracked fruitTicketGift: null | FruitTicketGift = null;
  @service declare store: Store;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.fruitTicketGift = this.store.createRecord('fruit-ticket-gift');
  }

  @action
  showFruitTixModal() {
    this.showingModal = !this.showingModal;
  }
}
