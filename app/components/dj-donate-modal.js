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

  get qualifiedDonationLink() {
    let pattern = /^http(s?):\/\//;
    if (this.donationLink && pattern.test(this.donationLink)) {
      return this.donationLink;
    } else {
      return `https://${this.donationLink}`;
    }
  }

  @tracked
  showingDjDonateModal = false;

  @action
  toggleDjDonateModal() {
    this.showingDjDonateModal = !this.showingDjDonateModal;
  }
}
