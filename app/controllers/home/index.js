import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Controller from '@ember/controller';

export default class IndexController extends Controller {
  @service('router') router;
@action
  browseLabel(label) {
    this.router.transitionTo('home.podcasts', { queryParams: { tags: label.name } });
  }
}
