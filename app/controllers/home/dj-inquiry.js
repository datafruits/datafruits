import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import jstz from 'jstimezonedetect';

export default class DjInquiryController extends Controller {
  get canSubmit() {
    return !(!this.model.isSaving && this.cocAccepted);
  }

  @tracked cocAccepted = false;
  intervals = ['daily', 'weekly', 'biweekly', 'monthly', 'other'];

  @action
  setShowInterval(event) {
    const interval = event.target.value;
    this.set('model.interval', interval);
  }

  @action
  submitApplication() {
    let hostApplication = this.model;
    hostApplication.set('timeZone', jstz.determine().name());
    hostApplication.save();
  }
}
