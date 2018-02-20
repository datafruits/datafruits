import Ember from 'ember';
import { initialize } from 'datafruits13/initializers/custom-emoji';
import { module, test } from 'qunit';
import { run } from '@ember/runloop';
import destroyApp from '../../helpers/destroy-app';
import Application from '@ember/application';

module('Unit | Initializer | custom emoji', {
  beforeEach() {
    run(() => {
      this.application = Application.create();
      this.application.deferReadiness();
    });
  },
  afterEach() {
    destroyApp(this.application);
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  initialize(this.application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
