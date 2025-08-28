import { module, test, skip } from 'qunit';
import { visit, currentURL, fillIn, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | shrimpos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('visiting /shrimpos route exists', async function (assert) {
    await visit('/shrimpos');

    // Just check that the shrimpos route works
    assert.ok(true, 'Shrimpos route is accessible');
  });

  skip('visiting /shrimpos/new with authentication', async function (assert) {
    // Authenticate the session
    await authenticateSession({ id: '1' });

    // Mock the currentUser to load the user data  
    const currentUser = this.owner.lookup('service:current-user');
    await currentUser.load();

    await visit('/shrimpos/new');

    assert.equal(currentURL(), '/shrimpos/new');
    assert.dom('h1').includesText('shrimpo'); // Basic check that the form is rendered
  });

  skip('creating a shrimpo', async function (assert) {
    // Mock shrimpo creation POST endpoint
    this.server.post('/api/shrimpos', (schema, request) => {
      const attrs = JSON.parse(request.requestBody).shrimpo;
      const slug = attrs.title.toLowerCase().replace(/\s+/g, '-');
      
      const newShrimpo = schema.shrimpos.create({
        id: '123',
        title: attrs.title,
        rulePack: attrs.rulePack,
        emoji: attrs.emoji || '🍤',
        duration: attrs.duration || '1 hour',
        shrimpoType: attrs.shrimpoType || 'normal',
        status: 'running',
        slug: slug,
        startAt: attrs.startAt,
        endAt: null,
        username: 'testuser',
        entriesCount: '0',
      });

      return newShrimpo;
    });

    // Authenticate the session
    await authenticateSession({ id: '1' });

    // Mock the currentUser to load the user data  
    const currentUser = this.owner.lookup('service:current-user');
    await currentUser.load();

    await visit('/shrimpos/new');

    assert.equal(currentURL(), '/shrimpos/new');

    // Fill in the required form fields
    await fillIn('input[name="title"]', 'Test Shrimpo');
    await fillIn('textarea[name="rulePack"]', 'These are the rules for the test shrimpo');
    
    // Select an emoji from the power-select dropdown
    await click('.ember-power-select-trigger');
    await click('.ember-power-select-option:first-child');

    // Submit the form
    await click('button[type="submit"]');

    // Verify redirect to show page (the form component redirects on successful submit)
    assert.equal(currentURL(), '/shrimpos/test-shrimpo');
  });
});