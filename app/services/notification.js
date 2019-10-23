import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  socket: service(),
  init() {
    this._super(...arguments);
    if("Notification" in window){
      Notification.requestPermission();
      let notificationsChannel = socket.channel("notifications", {});

      notificationsChannel.join().receive("ignore", function () {
        return console.log("auth error");
      }).receive("ok", function () {
        return console.log("metadata join ok");
      }).receive("timeout", function () {
        return console.log("Connection interruption");
      });

      metadataChannel.on("notification", (notification) => {
        console.log(notification);
        //this.set('title', metadata.message);
        //this.eventBus.publish("metadataUpdate", metadata.message);
        new Notification(notification);
      });
    }
  }
});
