import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query){
    return `${this.urlPrefix()}/podcasts/datafruits`;
  }
});
