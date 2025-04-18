import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class DjInquiryRoute extends Route {
  @service store;
  model() {
    let hostApplication;
    hostApplication = this.store.peekAll('host-application')[0];
    if (!hostApplication) {
      hostApplication = this.store.createRecord('host-application');
    }
    return hostApplication;
  }
}
