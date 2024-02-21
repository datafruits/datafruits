import Component from '@glimmer/component';
import ShrimpoValidations from '../../validations/shrimpo';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import RouterService from '@ember/routing/router-service';
import type Shrimpo from 'datafruits13/models/shrimpo';
import { BufferedChangeset } from 'ember-changeset/types';
import ENV from 'datafruits13/config/environment';

interface ShrimpoFormArgs {
  model: Shrimpo;
}

export default class ShrimpoForm extends Component<ShrimpoFormArgs> {
  ShrimpoValidations = ShrimpoValidations

  lengths = [
    '1 hour',
    '2 hours',
    '4 hours',
    '1 day',
    '2 days',
    '1 week'
  ];
  @service declare router: RouterService;
  @service declare activeStorage: any;

  @tracked uploadProgress = 0;

  @tracked coverArtUploadProgress = 0;

  @action
  setLength(changeset: BufferedChangeset, event: any){
    console.log('setting duration: ', event.target.value);
    changeset.set('duration', event.target.value);
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    this.router.transitionTo('home.shrimpos.show', data.slug);
  }

  @action
  onError() {
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

          changeset.set('zipFile', signedId);
        });
      }
    }
  }
}
