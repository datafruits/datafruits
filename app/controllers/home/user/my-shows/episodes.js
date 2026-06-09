import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class HomeUserMyShowsEpisodesController extends Controller{
  @service store;

  get fetchArchives() {
    return this.store.query('scheduled-show', { showSeries: this.model.slug, range: 'past' });
  }

  get fetchUpcoming() {
    return this.store.query('scheduled-show', { showSeries: this.model.slug, range: 'future' });
  } // normal class body definition here
}
