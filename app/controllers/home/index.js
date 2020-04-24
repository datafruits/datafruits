import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class IndexController extends Controller {
  @action
  browseLabel(label) {
    this.transitionToRoute('home.podcasts', { queryParams: { tags: label.name } });
  }
}
