import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
@tagName('')
export default class Notifications extends Component {
  @service
  socket;

  didInsertElement() {
    super.didInsertElement(...arguments);
    let socket = this.socket.socket;

    if("Notification" in window){
      Notification.requestPermission();
      let notificationsChannel = socket.channel("notifications", {});

      notificationsChannel.join().receive("ignore", function () {
        return console.log("auth error"); // eslint-disable-line no-console
      }).receive("ok", function () {
        return console.log("notification channel join ok"); // eslint-disable-line no-console
      }).receive("timeout", function () {
        return console.log("Connection interruption"); // eslint-disable-line no-console
      });

      notificationsChannel.on("notification", (notification) => {
        console.log(`notification channel: ${notification.message}`); // eslint-disable-line no-console
        const icon = "/assets/images/logo.png";
        const body = notification.message;
        new Notification("DATAFRUITS.FM", { body, icon });
      });
    }
  }
}
