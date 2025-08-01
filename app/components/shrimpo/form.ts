import Component from '@glimmer/component';
import ShrimpoValidations from '../../validations/shrimpo';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { BufferedChangeset } from 'ember-changeset/types';
import ENV from 'datafruits13/config/environment';

interface JsonApiError {
  detail: string;
  status?: string;
  title?: string;
  source?: {
    pointer?: string;
  };
}

interface ShrimpoFormArgs {
  model: Shrimpo;
}

export default class ShrimpoForm extends Component<ShrimpoFormArgs> {
  ShrimpoValidations = ShrimpoValidations;

  @tracked errors: string[] = [];

  @service currentUser: any;

  lengths = [
    '1 hour',
    '2 hours',
    '4 hours',
    '1 day',
    '2 days',
    '1 week',
    '1 month',
    '3 months',
  ];

  shrimpoTypes = [
    'normal',
    'mega'
  ];

  @service declare router: RouterService;
  @service declare activeStorage: any;

  @tracked uploadProgress = 0;

  @tracked coverArtUploadProgress = 0;

  @tracked duration = '1 hour';

  _depostAmount() {
    switch(this.duration) {
      case '1 hour':
        return 500;
      case '2 hours':
        return 750;
      case '4 hours':
        return 1000;
      case '1 day':
        return 1500;
      case '2 days':
        return 1750;
      case '1 week':
        return 2000;
      case '1 month':
        return 5000;
      case '3 months':
        return 7500;
      default:
        return 100;
    }
  }

  get depositAmount() {
    return this._depostAmount();
  }

  get notEnoughBalance() {
    return this.currentUser.user.fruitTicketBalance < this._depostAmount();
  }

  @action
  setLength(changeset: BufferedChangeset, event: any){
    console.log('setting duration: ', event.target.value);
    changeset.set('duration', event.target.value);
    this.duration = event.target.value;
  }

  @action
  setShrimpoType(changeset: BufferedChangeset, event: any){
    console.log('setting duration: ', event.target.value);
    changeset.set('shrimpoType', event.target.value);
    //this.duration = event.target.value;
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log('on shrimpo form submit');
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.shrimpos.show', data.slug);
  }

  @action
  onError(errors: JsonApiError[]) {
    this.errors = errors.map(error => error.detail);
    console.log('onError: ', errors);
    alert("Couldn't save shrimpo...check the form for errors.");
  }

  @action updateCoverArt(changeset: BufferedChangeset, event: Event){
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.coverArtUploadProgress= progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('coverArt', signedId);
        });
      }
    }
  }


  @action
  uploadZip(changeset: BufferedChangeset, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.uploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('zip', signedId);
        });
      }
    }
  }
}
