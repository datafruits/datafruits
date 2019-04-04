import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(){
    return `${this.urlPrefix()}/podcasts/datafruits`;
  }
});
