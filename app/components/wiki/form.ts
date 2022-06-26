import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Store from '@ember-data/store';

interface WikiFormArgs {}

export default class WikiForm extends Component<WikiFormArgs> {
  @service declare store: Store;

  @action
  saveArticle() {
  }
}
