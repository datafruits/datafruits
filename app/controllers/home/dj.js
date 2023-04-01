import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

@classic
export default class DjController extends Controller {
  @service router;
  queryParams = ['page'];

  @action
  browseLabel(label) {
    this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
  }

  get qualifiedHomepageUrl() {
    let pattern = /^http(s?):\/\//;
    if (this.model.homepage && pattern.test(this.model.homepage)) {
      return this.model.homepage;
    } else {
      return `https://${this.model.homepage}`;
    }
  }
}
