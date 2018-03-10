import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForFindAll(){
    return `${this.urlPrefix()}/labels.json`;
  }
});
