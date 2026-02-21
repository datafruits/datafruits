import { BaseService } from '../../../framework/index.js';
import { Socket } from 'phoenix';

export default class SocketService extends BaseService {
  constructor(chatSocketUrl) {
    super();
    const url = chatSocketUrl
      ?? (typeof window !== 'undefined' ? window.__ENV?.CHAT_SOCKET_URL : undefined)
      ?? '';
    this.socket = new Socket(url, {
      logger: function logger(/*kind, msg, data*/) {
        //console.log(kind + ": " + msg, data);
      },
    });
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
}
