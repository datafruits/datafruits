import classic from 'ember-classic-decorator';
import { tagName } from '@ember-decorators/component';
import { inject as service } from '@ember/service';
import App from '../app';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { hash } from 'rsvp';

@classic
@tagName('')
export default class PodcastsLoader extends Component {
  @service
  store;

  init() {
    super.init(...arguments);
    this.data = [];
  }

  didReceiveAttrs() {
    let query = this.query;
    this.fetchData.perform(query);
  }

  @(task(function* (query) {
    yield timeout(1000);
    let podcasts = this.store.queryRecord('podcast', query).then((podcast) => {
      return hash({
        tracks: podcast.get('tracks'),
        meta: App.storeMeta['podcast'],
        labels: this.store.findAll('label'),
      });
    });
    let resolvedPodcasts = yield podcasts;
    return this.set('data', resolvedPodcasts);
  }).restartable())
  fetchData;
}
