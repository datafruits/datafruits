import Route from '@ember/routing/route';
import { hash } from 'rsvp';

export default Route.extend({
  model: async function(params){
    params.page = params.page || 1;
    const podcast = await this.store.queryRecord('podcast', {
      name: 'datafruits',
      page: params.page,
      tags: params.tags,
      query: params.query
    });
    return hash({
      tracks: podcast.get('tracks'),
      labels: this.store.loadRecords('label'),
    })
  }
});
