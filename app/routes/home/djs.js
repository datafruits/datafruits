import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class DjsRoute extends Route {
  model() {
    return this.store.loadRecords('dj');
  }
}
