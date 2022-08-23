import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import WikiPageValidations from '../../validations/wiki-page';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import emojione from 'emojione';
import { SafeString } from 'handlebars';
import { htmlSafe } from '@ember/template';

interface WikiFormArgs {
  changeset: any;
}

export default class WikiForm extends Component<WikiFormArgs> {
  WikiPageValidations = WikiPageValidations;

  @service declare store: Store;
  @service declare router: RouterService;

  @tracked previewBody: SafeString = new SafeString('');
  @tracked previewTitle: SafeString = new SafeString('');

  @action
  setPreviewBody(value: string) {
    this.previewBody = htmlSafe(emojione.shortnameToImage(value));
  }

  @action
  setPreviewTitle(value: string) {
    this.previewTitle = htmlSafe(emojione.shortnameToImage(value));
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.wiki.show', data.title);
  }

  @action
  onError() {
    alert("Couldn't save wiki article...check the form for errors.");
  }

}
