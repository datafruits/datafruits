import Component from '@glimmer/component';
import { action } from '@ember/object';
import fetch from 'fetch';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';

export default class StudioDonationLink extends Component {
  @service session;

  @service eventBus;
  @service metadata;

  @tracked url;

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('donationLinkUpdate', this, 'setDonationLink');
  }

  setDonationLink() {
    this.url = this.metadata.donationLink;
  }

  @action
  updateMetadata(event) {
    event.preventDefault();
    const data = { donation_link: { url: this.url } };
    fetch(`${ENV.API_HOST}/donation_link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        //this.flashMessages.success('Updated donation link!');
      })
      .catch((error) => {
        //this.flashMessages.error('error updating donation link');
        console.log('error updating metadata');
        console.log(error);
      });
  }
}
