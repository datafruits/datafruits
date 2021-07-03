// import { action, computed } from '@ember/object';
// import { or } from '@ember/object/computed';
// import QueryParams from 'ember-parachute';
import Controller from '@ember/controller';

// export const PodcastQueryParams = new QueryParams({
//   page: {
//     defaultValue: 1,
//     refresh: true,
//   },
//   tags: {
//     defaultValue: [],
//     refresh: true,
//     serialize(value) {
//       return value.toString();
//     },
//     deserialize(value = '') {
//       return value.split(',');
//     },
//   },
//   query: {
//     defaultValue: '',
//     refresh: true,
//   },
// });

export default class PodcastsController extends Controller {
  // @or('queryParamsState.{page,query,tags}.changed')
  // queryParamsChanged;
  //
  // @computed('query', 'tags', 'page')
  // get searchParams() {
  //   return { query: this.query, tags: this.tags, page: this.page };
  // }
  //
  // @action
  // updateSearch(query) {
  //   console.log('updateSearch on controller');
  //   console.log(query);
  //   this.set('query', query.text);
  //   this.set('tags', query.labels);
  //   this.set('page', 1);
  // }
}
