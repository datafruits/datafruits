import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DjDonateButtonComponent extends Component {
  @service eventBus;
  @service metadata;

  @tracked donationLink;

  constructor(){
    super(...arguments);
    this.eventBus.subscribe("donationLinkUpdate", this, "setDonationLink");
  }

  setDonationLink(){
    this.donationLink =  this.metadata.donationLink;
  }
}
