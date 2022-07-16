import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import WikiPageValidations from '../../validations/wiki-page';
import Store from '@ember-data/store';
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
    debugger
    //this.router.transitionTo('wiki.show', );
  }

  @action
  saveArticle(e: any) {
    e.preventDefault();
    const changeset = this.args.changeset;
    changeset.validate().then(() => {
      if (changeset.isValid) {
        changeset
          .save()
          .then(() => {
            console.log('saved article');
          })
          .catch((error: string) => {
            console.log(error); // eslint-disable-line no-console
            alert('couldnt save article!');
          });
      } else {
        console.log('changeset invalid'); // eslint-disable-line no-console
        console.log(changeset.get('errors')); // eslint-disable-line no-console
      }
    });
  }
}
