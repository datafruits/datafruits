import Route from '@ember/routing/route';

export default Route.extend({
  model(){
    let hostApplication;
    hostApplication = this.store.peekAll('host-application').get('firstObject');
    if(!hostApplication){
      hostApplication = this.store.createRecord('host-application');
    }
    return hostApplication;
  }
});
