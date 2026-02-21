import { BaseService, service } from '../../framework/index.js';

function isEmpty(val) {
  return val === null || val === undefined || val === '';
}

export default class MetadataService extends BaseService {
  @service('eventBus')
  eventBus;

  @service('socket')
  socket;

  title = '';
  donationLink = '';

  constructor() {
    super();
    const socket = this.socket.socket;
    const metadataChannel = socket.channel('metadata', {});

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

    metadataChannel.on('canonical_metadata', (metadata) => {
      console.log('metadata channel canonical_metadata: ', metadata);
      this.eventBus.publish('canonicalMetadataUpdate', metadata);
    });

    this._metadataChannel = metadataChannel;
  }

  willDestroy() {
    if (this._metadataChannel) {
      this._metadataChannel.off('metadata');
      this._metadataChannel.off('canonical_metadata');
    }
  }
}
