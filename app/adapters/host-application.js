import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForCreateRecord(){
    return `${this.urlPrefix()}/host_applications`;
  }
});
