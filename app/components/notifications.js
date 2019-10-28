import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',
  socket: service(),
  didInsertElement(){
    this._super(...arguments);
    let socket = this.socket.socket;

    if("Notification" in window){
      Notification.requestPermission();
      let notificationsChannel = socket.channel("notifications", {});

      notificationsChannel.join().receive("ignore", function () {
        return console.log("auth error");
      }).receive("ok", function () {
        return console.log("notification channel join ok");
      }).receive("timeout", function () {
        return console.log("Connection interruption");
      });

      notificationsChannel.on("notification", (notification) => {
        console.log(notification.message);
        const icon = "/assets/images/logo.png";
        const body = notification.message;
        new Notification("DATAFRUITS.FM", { body, icon });
      });
    }
  }
});
