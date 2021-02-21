import classic from 'ember-classic-decorator';
import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

@classic
export default class MetadataService extends Service {
  @service
  eventBus;

  @service
  socket;

  title = '';

  init() {
    super.init(...arguments);
    let socket = this.socket.socket;

    let metadataChannel = socket.channel('metadata', {});

    metadataChannel
      .join()
      .receive('ignore', function () {
        return console.log('auth error'); // eslint-disable-line no-console
      })
      .receive('ok', function () {
        return console.log('metadata join ok'); // eslint-disable-line no-console
      })
      .receive('timeout', function () {
        return console.log('Connection interruption'); // eslint-disable-line no-console
      });

    metadataChannel.on('metadata', (metadata) => {
      console.log(`metadata channel donation_link: ${metadata.donation_link}`); // eslint-disable-line no-console
      console.log(`metadata channel message: ${metadata.message}`); // eslint-disable-line no-console
      if (!isEmpty(metadata.message)) {
        this.set('title', metadata.message);
        this.eventBus.publish('metadataUpdate', metadata.message);
      }
      if (!isEmpty(metadata.donation_link)) {
        this.set('donationLink', metadata.donation_link);
        this.eventBus.publish('donationLinkUpdate', metadata.donation_link);
      }
    });
  }
}
