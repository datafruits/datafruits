import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForQueryRecord(query){
    if(query.next){
      return `${this.urlPrefix()}/scheduled_shows/next.json`;
    }
  },
  urlForFindRecord(id){
    return `${this.urlPrefix()}/scheduled_shows/${id}.json`;
  }
});
