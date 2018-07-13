import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindAll(){
    return `${this.urlPrefix()}/djs.json`;
  },
  urlForFindRecord(name){
    return `${this.urlPrefix()}/djs/${name}.json`;
  }
});
