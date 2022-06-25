import Component from '@glimmer/component';
import { action } from '@ember/object';
import { Service, inject as service } from '@ember/service';

interface WikiFormArgs {}

export default class WikiForm extends Component<WikiFormArgs> {
  @service store;

  @action
  saveArticle() {
  }
}
