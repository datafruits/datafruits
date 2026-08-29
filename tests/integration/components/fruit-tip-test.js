import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { setupIntl } from 'ember-intl/test-support';
import fruitTypes from 'datafruits13/fruit-types';

function generateExpectedFruitTipText() {
  const levelTexts = [];
  const costTexts = [];
  
  fruitTypes.forEach(fruit => {
    if (fruit.levelReq > 0) {
      levelTexts.push(`Lv. ${fruit.levelReq}`);
    }
    if (fruit.cost > 0) {
      costTexts.push(`Ƒ${fruit.cost}`);
    }
  });
  
  return [...levelTexts, ...costTexts].join(' ');
}

module('Integration | Component | fruit-tip', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<FruitTip />`);

    // Generate expected text dynamically from fruit types
    const expectedText = generateExpectedFruitTipText();
    assert.dom(this.element).hasText(expectedText);
  });

  skip('it shows fruit tipping options when clicked', async function (/*assert*/) {
    await render(hbs`<FruitTip />`);
    click('button');
  });

  test('prevents multiple concurrent paid fruit summons', async function (assert) {
    assert.expect(2);

    // Create a paid fruit (cost > 0)
    const paidFruit = { name: 'metal-pineapple', cost: 200, levelReq: 0 };
    
    // Mock services
    this.owner.register('service:store', {
      createRecord() {
        return {
          save() {
            return new Promise(() => {}); // Never resolves to simulate in-progress
          }
        };
      }
    });

    this.owner.register('service:current-user', {
      load() {
        return Promise.resolve();
      }
    });

    this.owner.register('service:chat', {
      getFruitCount() { return 0; },
      push() {},
      username: 'testuser',
      token: 'testtoken'
    });

    this.owner.register('service:session', {
      isAuthenticated: true
    });

    await render(hbs`<FruitTip />`);

    const component = this.owner.lookup('component:fruit-tip');
    
    // Assert initial state
    assert.strictEqual(component.isPaidFruitSummonInProgress, false, 
      'Should start with no paid fruit summon in progress');

    // Mock confirm to always return true
    const originalConfirm = window.confirm;
    window.confirm = () => true;

    try {
      // Start first paid summon (will hang due to mocked save)
      const firstCall = component.fruitTip(paidFruit, { preventDefault() {} });
      
      // Try second paid summon while first is in progress
      const secondCall = component.fruitTip(paidFruit, { preventDefault() {} });

      // The second call should return immediately due to debouncing
      assert.ok(secondCall === undefined, 
        'Second concurrent paid fruit summon should be prevented');

    } finally {
      window.confirm = originalConfirm;
    }
  });

  test('allows multiple free fruit tips without debouncing', async function (assert) {
    assert.expect(1);

    // Create a free fruit (cost = 0)
    const freeFruit = { name: 'strawberry', cost: 0, levelReq: 0 };
    
    let pushCallCount = 0;

    // Mock services
    this.owner.register('service:chat', {
      getFruitCount() { return 0; },
      push() { 
        pushCallCount++; 
      },
      username: 'testuser',
      token: 'testtoken'
    });

    this.owner.register('service:session', {
      isAuthenticated: true
    });

    await render(hbs`<FruitTip />`);

    const component = this.owner.lookup('component:fruit-tip');
    
    // Call fruitTip multiple times with free fruit
    component.fruitTip(freeFruit, { preventDefault() {} });
    component.fruitTip(freeFruit, { preventDefault() {} });
    component.fruitTip(freeFruit, { preventDefault() {} });

    // All calls should go through since free fruits are not debounced
    assert.strictEqual(pushCallCount, 3, 
      'Free fruit tips should not be debounced');
  });
});
