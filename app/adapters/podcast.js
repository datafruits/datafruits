import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query){
    let name = query.name;
    return `${this.urlPrefix()}/podcasts/${name}`;
  }
});
