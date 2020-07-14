import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import { or } from '@ember/object/computed';
import Controller from '@ember/controller';
import QueryParams from 'ember-parachute';

export const PodcastQueryParams = new QueryParams({
  page: {
    defaultValue: 1,
    refresh: true,
  },
  tags: {
    defaultValue: [],
    refresh: true,
    serialize(value) {
      return value.toString();
    },
    deserialize(value = '') {
      return value.split(',');
    },
  },
  query: {
    defaultValue: '',
    refresh: true,
  },
});

@classic
export default class PodcastsController extends Controller.extend(PodcastQueryParams.Mixin) {
  @or('queryParamsState.{page,query,tags}.changed')
  queryParamsChanged;

  @computed('query', 'tags', 'page')
  get searchParams() {
    return { query: this.query, tags: this.tags, page: this.page };
  }

  @action
  updateSearch(query, tags) {
    this.set('query', query);
    this.set('tags', tags);
    this.set('page', 1);
  }
}
