import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  eventBus: service(),
  socket: service(),
  title: "",
  init() {
    this._super(...arguments);
    let socket = this.socket.socket;

    let metadataChannel = socket.channel("metadata", {});

    metadataChannel.join().receive("ignore", function () {
      return console.log("auth error");
    }).receive("ok", function () {
      return console.log("metadata join ok");
    }).receive("timeout", function () {
      return console.log("Connection interruption");
    });

    metadataChannel.on("metadata", (metadata) => {
      console.log(`metadata channel: ${metadata.message}`);
      this.set('title', metadata.message);
      this.eventBus.publish("metadataUpdate", metadata.message);
    });
  }
});
