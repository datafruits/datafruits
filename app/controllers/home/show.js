import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class ShowController extends Controller {
  @service session;
  @service currentUser;
  @service router;
  queryParams = ['page'];

  @action
  browseLabel(label) {
    this.router.transitionTo('home.podcasts', { queryParams: { tags: label.name } });
  }
}
