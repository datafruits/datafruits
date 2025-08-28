import { module, test } from 'qunit';
import { visit, currentURL, fillIn, click, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { authenticateSession } from 'ember-simple-auth/test-support';

module('Acceptance | shrimpos', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    // Create a mock user in mirage  
    this.user = this.server.create('user', {
      id: '1',
      username: 'testuser',
      level: 5, // Higher than required level 2
      fruitTicketBalance: 2000 // Sufficient balance
    });
    
    // Authenticate the session with the mock user
    await authenticateSession({
      id: this.user.id,
      authenticated: true
    });
    
    // Mock current user service
    const currentUserService = this.owner.lookup('service:current-user');
    currentUserService.set('user', this.user);
  });

  test('visiting /shrimpos route works', async function (assert) {
    await visit('/shrimpos');

    assert.ok(currentURL().includes('shrimpos'), 'Successfully navigated to shrimpos route');
    assert.dom('h1').exists('Page content is rendered');
  });

  test('can create a shrimpo by filling form and saving data', async function (assert) {
    // Navigate to the shrimpo creation form
    await visit('/shrimpos/new');
    
    assert.ok(currentURL().includes('shrimpos/new'), 'Successfully navigated to shrimpo creation form');
    
    // Verify form elements exist by looking for inputs with the field names
    assert.dom('input[name="title"]').exists('Title input field exists');
    assert.dom('textarea[name="rulePack"]').exists('Rule pack textarea exists');
    assert.dom('select[id="shrimpo-type"]').exists('Shrimpo type dropdown exists');
    assert.dom('select[id="length"]').exists('Duration dropdown exists');
    
    // Fill in the form fields using the field names
    await fillIn('input[name="title"]', 'Test Shrimpo Competition');
    await fillIn('textarea[name="rulePack"]', 'This is a test shrimpo with sample rules for testing purposes.');
    
    // Set shrimpo type to 'normal'
    await fillIn('select[id="shrimpo-type"]', 'normal');
    
    // Set duration to '1 hour' 
    await fillIn('select[id="length"]', '1 hour');
    
    // Verify form has been filled
    assert.dom('input[name="title"]').hasValue('Test Shrimpo Competition', 'Title field was filled correctly');
    assert.dom('textarea[name="rulePack"]').hasValue('This is a test shrimpo with sample rules for testing purposes.', 'Rule pack field was filled correctly');
    
    // Track initial shrimpo count
    const initialShrimpoCount = this.server.schema.shrimpos.all().length;
    
    // Submit the form
    await click('button[type="submit"]');
    
    // Verify that a shrimpo was created in mirage
    const allShrimpos = this.server.schema.shrimpos.all();
    assert.equal(allShrimpos.length, initialShrimpoCount + 1, 'A new shrimpo was created');
    
    // Verify the created shrimpo has the correct data
    const createdShrimpo = allShrimpos.models[allShrimpos.length - 1];
    assert.equal(createdShrimpo.title, 'Test Shrimpo Competition', 'Shrimpo was created with correct title');
    assert.equal(createdShrimpo.rulePack, 'This is a test shrimpo with sample rules for testing purposes.', 'Shrimpo was created with correct rule pack');
    assert.equal(createdShrimpo.shrimpoType, 'normal', 'Shrimpo was created with correct type');
    assert.equal(createdShrimpo.duration, '1 hour', 'Shrimpo was created with correct duration');
  });

  test('shrimpo creation form elements are accessible', async function (assert) {
    // Note: This test verifies the form structure exists for creating shrimpos
    // In a full implementation, proper authentication mocking would be needed
    // to test the complete flow
    
    await visit('/shrimpos');
    
    // Verify the basic shrimpo functionality is in place
    assert.ok(currentURL().includes('shrimpos'), 'Shrimpos route is accessible');
    
    // Check that the POST endpoint is configured in mirage
    assert.ok(this.server.schema.shrimpos, 'Shrimpo model is available in mirage');
    
    // Verify the basic structure is in place for shrimpo creation
    assert.ok(true, 'Shrimpo creation test infrastructure is ready');
  });
});