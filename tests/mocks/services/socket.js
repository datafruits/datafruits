import Service from '@ember/service';
import ENV from 'datafruits13/config/environment';

class MockBase {
  constructor(opts) {
    this.opts = opts;
  }
  onOpen(cb) {
    return (this.onOpenHandler = cb);
  }

  onError(cb) {
    return (this.onErrorHandler = cb);
  }

  onClose(cb) {
    return (this.onCloseHandler = cb);
  }
}

class MockChannel extends MockBase {
  receiveHandlers = {};
  eventHandlers = {};

  constructor(topic, opts) {
    super(opts);
    this.topic = topic;
  }

  join() {
    return this;
  }

  receive(msg, cb) {
    this.receiveHandlers[msg] = cb;
    return this;
  }

  on(event, cb) {
    if (event === 'notauthorized') {
      // testem doesn't like window.alert
      // Also: using an arrow function to preserve
      // "this" keyword
      this.eventHandlers[event] = (msg) => {
        // I guess this means that "new:msg" has to be
        // declared before "nothauthorized" but...
        this.eventHandlers['new:msg'](msg.error);
      };
      return;
    }
    this.eventHandlers[event] = cb;
  }

  dispatch(eventName, args) {
    this.eventHandlers[eventName](args);
  }
}

class MockSocket extends MockBase {
  channels = {};

  constructor(endpoint, opts) {
    super(opts);
    this.endpoint = endpoint;
  }

  connect() {
    return;
  }

  channel(description, opts) {
    if (!this.channels[description]) {
      this.channels[description] = new MockChannel(description, opts);
    }
    return this.channels[description];
  }
}

export default class MockSocketService extends Service {
  constructor(args) {
    super(args);
    this.socket =
      new MockSocket(ENV.CHAT_SOCKET_URL, {
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
