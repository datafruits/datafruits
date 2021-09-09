import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export default class DjInquiryController extends Controller {
  get canSubmit() {
    return !(!this.model.isSaving && this.cocAccepted);
  }

  @tracked cocAccepted = false;
  intervals = ['daily', 'weekly', 'biweekly', 'monthly', 'other'];

  @action
  setShowInterval(event) {
    const interval = event.target.value;
    this.model.interval = interval;
  }

  @action
  submitApplication() {
    let hostApplication = this.model;
    hostApplication.set('timeZone', dayjs.tz.guess());
    hostApplication.save();
  }
}
