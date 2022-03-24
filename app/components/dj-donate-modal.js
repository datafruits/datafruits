import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DjDonateModalComponent extends Component {
  @service eventBus;
  @service metadata;

  @tracked donationLink;

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('donationLinkUpdate', this, 'setDonationLink');
  }

  setDonationLink() {
    this.donationLink = this.metadata.donationLink;
  }

  @tracked
  showingDjDonateModal = false;

  @action
  toggleDjDonateModal() {
    this.showingDjDonateModal = !this.showingDjDonateModal;
  }
}
