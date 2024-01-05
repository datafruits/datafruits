import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class ShowController extends Controller {
  @service session;
  @service currentUser;
  @service router;
  queryParams = ['page'];

  @action
  browseLabel(label) {
    this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
  }
}
