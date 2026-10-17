import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import WikiPageValidations from '../../validations/wiki-page';
import Store from '@ember-data/store';
import RouterService from '@ember/routing/router-service';
import { tracked } from '@glimmer/tracking';
import type WikiPage from 'datafruits13/models/wiki-page';
import type EmojiZoneService from 'datafruits13/services/emoji-zone';

interface WikiFormSignature {
  Args: {
    model: WikiPage;
  };
}

export default class WikiForm extends Component<WikiFormSignature> {
  WikiPageValidations = WikiPageValidations;

  @service declare store: Store;
  @service declare router: RouterService;
  @service('emoji-zone') declare emojiZone: EmojiZoneService;

  @tracked previewBody: string = this.args.model.body || '';
  @tracked previewTitle: string = this.args.model.title || '';

  @action
  setPreviewBody(value: string) {
    this.previewBody = value;
  }

  @action
  setPreviewTitle(value: string) {
    this.previewTitle = value;
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.wiki.show', data.slug);
  }

  @action
  onError() {
    alert("Couldn't save wiki article...check the form for errors.");
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    WikiForm: typeof WikiForm;
  }
}