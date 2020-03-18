import Service, { inject as service } from '@ember/service';

export default Service.extend({
  eventBus: service(),
  socket: service(),
  title: "",
  init() {
    this._super(...arguments);
    let socket = this.socket.socket;

    let metadataChannel = socket.channel("metadata", {});

    metadataChannel.join().receive("ignore", function () {
      return console.log("auth error"); // eslint-disable-line no-console
    }).receive("ok", function () {
      return console.log("metadata join ok"); // eslint-disable-line no-console
    }).receive("timeout", function () {
      return console.log("Connection interruption"); // eslint-disable-line no-console
    });

    metadataChannel.on("metadata", (metadata) => {
      console.log(`metadata channel donation_link: ${metadata.donation_link}`); // eslint-disable-line no-console
      console.log(`metadata channel message: ${metadata.message}`); // eslint-disable-line no-console
      this.set('title', metadata.message);
      this.set('donationLink', metadata.donation_link);
      this.eventBus.publish("metadataUpdate", metadata.message);
      this.eventBus.publish("donationLinkUpdate", metadata.donation_link);
    });
  }
});
