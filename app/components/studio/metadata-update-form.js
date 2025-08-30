import Component from '@glimmer/component';
import { action } from '@ember/object';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import { inject as service } from '@ember/service';

export default class StudioMetadataUpdateForm extends Component {
  @service session;
  @service eventBus;
  @service metadata;

  @tracked title;

  constructor() {
    super(...arguments);
    this.eventBus.subscribe('metadataUpdate', this, 'setTitle');
  }

  setTitle() {
    this.title = this.metadata.title;
  }

  @action
  updateMetadata(event) {
    event.preventDefault();
    const data = { metadata: { title: this.title } };
    fetch(`${ENV.API_HOST}/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        //this.flashMessages.success('Updated stream title!');
      })
      .catch((error) => {
        //this.flashMessages.error('error updating stream title');
        console.log('error updating metadata');
        console.log(error);
      });
  }
}
