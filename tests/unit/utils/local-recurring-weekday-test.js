import { module, test } from 'qunit';
import localRecurringWeekday from 'datafruits13/utils/local-recurring-weekday';

module('Unit | Utility | local-recurring-weekday', function () {
  test('shifts the stored weekday using the show timezone, not the timestamp weekday', function (assert) {
    assert.strictEqual(localRecurringWeekday('Monday', '2023-10-08T00:00:58.000Z', 'Tokyo', 'America/Los_Angeles'), 'Sunday');
    assert.strictEqual(localRecurringWeekday('Monday', '2023-10-08T00:00:58.000Z', 'Tokyo', 'Asia/Tokyo'), 'Monday');
  });

  test('handles Pacific standard and daylight saving time', function (assert) {
    assert.strictEqual(localRecurringWeekday('Monday', '2026-01-05T07:30:00Z', 'Asia/Tokyo', 'America/Los_Angeles'), 'Sunday');
    assert.strictEqual(localRecurringWeekday('Monday', '2026-07-06T07:30:00Z', 'Asia/Tokyo', 'America/Los_Angeles'), 'Monday');
  });

  test('handles forward shifts and week boundaries', function (assert) {
    assert.strictEqual(localRecurringWeekday('Sunday', '2026-01-05T04:00:00Z', 'Pacific Time (US & Canada)', 'Asia/Tokyo'), 'Monday');
    assert.strictEqual(localRecurringWeekday('Sunday', '2026-01-04T00:00:00Z', 'Tokyo', 'America/Los_Angeles'), 'Saturday');
  });

  test('preserves the weekday when timezone or start time is unavailable or invalid', function (assert) {
    for (const [time, zone] of [[null, 'Tokyo'], ['invalid', 'Tokyo'], ['2026-01-05T00:00:00Z', null], ['2026-01-05T00:00:00Z', 'unknown']]) {
      assert.strictEqual(localRecurringWeekday('Monday', time, zone, 'America/Los_Angeles'), 'Monday');
    }
  });
});
