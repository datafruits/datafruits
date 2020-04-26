import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class DjInquiryRoute extends Route {
  model() {
    let hostApplication;
    hostApplication = this.store.peekAll('host-application').get('firstObject');
    if(!hostApplication){
      hostApplication = this.store.createRecord('host-application');
    }
    return hostApplication;
  }
}
