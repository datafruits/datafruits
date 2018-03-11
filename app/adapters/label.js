import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindAll(){
    return `${this.urlPrefix()}/labels.json`;
  },
  urlForFindRecord(id){
    return `${this.urlPrefix()}/label/${id}.json`;
  }
});
