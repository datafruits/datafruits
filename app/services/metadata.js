import Service, { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { registerDestructor } from '@ember/destroyable';

export default class MetadataService extends Service {
  @service
  eventBus;

  @service
  socket;

  title = '';

  constructor() {
    super(...arguments);
    let socket = this.socket.socket;

    let metadataChannel = socket.channel('metadata', {});

    metadataChannel
      .join()
      .receive('ignore', function () {
        return console.log('auth error');  
      })
      .receive('ok', function () {
        return console.log('metadata join ok');  
      })
      .receive('timeout', function () {
        return console.log('Connection interruption');  
      });

    metadataChannel.on('metadata', (metadata) => {
      console.log(`metadata channel donation_link: ${metadata.donation_link}`);  
      console.log(`metadata channel message: ${metadata.message}`);  
      if (!isEmpty(metadata.message)) {
        this.title = metadata.message;
        this.eventBus.publish('metadataUpdate', metadata.message);
      }
      if (!isEmpty(metadata.donation_link)) {
        this.donationLink = metadata.donation_link;
        this.eventBus.publish('donationLinkUpdate', metadata.donation_link);
      }
    });

    registerDestructor(this, () => {
      metadataChannel.off('metadata');
    });
  }
}
