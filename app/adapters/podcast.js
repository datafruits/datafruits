import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindRecord(id){
    return `${this.urlPrefix()}/scheduled_shows/${id}.json`;
  }
});
