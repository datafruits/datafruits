import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class HomeUserMyShowsEpisodesController extends Controller{
  @service store;

  @action
  fetchArchives() {
    return this.store.query('scheduled-show', { showSeries: this.model.slug, status: 'archive_published' });
  }

  @action
  fetchUpcoming() {
    return this.store.query('scheduled-show', { showSeries: this.model.slug, status: 'archive_unpublished' });
  } // normal class body definition here
}
