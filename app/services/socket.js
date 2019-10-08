import Service from '@ember/service';
import { Socket } from "phoenix";
import ENV from "datafruits13/config/environment";

export default Service.extend({
  init() {
    this._super(...arguments);
    this.set('socket', new Socket(ENV.CHAT_SOCKET_URL, {

      logger: function logger(/*kind, msg, data*/) {
        //console.log(kind + ": " + msg, data);
      }
    }));
    this.socket.connect();

    this.socket.onOpen(function (/*ev*/) {
      //return console.log("OPEN", ev);
    });
    this.socket.onError(function (/*ev*/) {
      //return console.log("ERROR", ev);
    });
    this.socket.onClose(function (/*e*/) {
      //return console.log("CLOSE", e);
    });
  }
});
