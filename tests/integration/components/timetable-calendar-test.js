import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Service from '@ember/service';

import { setupIntl } from 'ember-intl/test-support';

class MockStoreService extends Service {
  queryResult = undefined;

  query() {
    if (this.queryResult !== undefined) {
      return this.queryResult;
    }
    return new Promise(() => {});
  }
}

module('Integration | Component | timetable calendar', function (hooks) {
  setupRenderingTest(hooks);

  setupIntl(hooks, 'en-us');

  hooks.beforeEach(function () {
    this.owner.register('service:store', MockStoreService);
  });

  test('it renders the loading state while timetable data is pending', async function (assert) {
    await render(hbs`<TimetableCalendar />`);

    assert.dom('[data-test-timetable-schedule-table]').doesNotExist();
    assert.dom(this.element).includesText('Loading...');
  });

  test('it toggles to availability view', async function (assert) {
    this.owner.lookup('service:store').queryResult = Promise.resolve([
      {
        start: '2026-05-12T10:00:00Z',
        end: '2026-05-12T11:00:00Z',
        title: 'Test Show',
        showSeriesSlug: 'test-series',
        slug: 'test-show',
      },
    ]);

    await render(hbs`<TimetableCalendar />`);

    assert.dom('[data-test-timetable-schedule-table]').exists();
    assert.dom('[data-test-timetable-availability-table]').doesNotExist();

    await click('[data-test-timetable-view-availability]');

    assert.dom('[data-test-timetable-availability-table]').exists();
    assert.dom('[data-test-timetable-schedule-table]').doesNotExist();
  });
});
