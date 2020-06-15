import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import ENV from "datafruits13/config/environment";

module('Unit | Service | socket', function(hooks) {
  setupTest(hooks);

  test('it creates a socket', function(assert) {
    let socketService = this.owner.lookup('service:socket');
    assert.ok(socketService.socket)
  });

  test('it creates a socket at the given endpoint', function (assert) {
    let socketService = this.owner.lookup('service:socket');
    assert.ok(socketService.socket.conn.url.includes(ENV.CHAT_SOCKET_URL))
  })
});
