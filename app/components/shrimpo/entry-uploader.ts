import Component from '@glimmer/component';
import ShrimpoEntryValidations from '../../validations/shrimpo-entry';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import type Shrimpo from 'datafruits13/models/shrimpo';
import ENV from 'datafruits13/config/environment';

interface ShrimpoEntryUploaderArgs {
  shrimpo: Shrimpo;
  shrimpoEntry: ShrimpoEntry;
}

export default class ShrimpoEntryUploader extends Component<ShrimpoEntryUploaderArgs> {
  ShrimpoEntryValidations = ShrimpoEntryValidations;

  @service declare activeStorage: any;
  @service declare store: any;

  @tracked uploadProgress = 0;

  @tracked isUploading = false;

  @tracked ccLicenseAccepted = false;

  // is this shrimpo still accepting entries
  get canSubmitEntry() {
    return this.args.shrimpo.multiSubmitAllowed || this.args.shrimpoEntry.isNew;
  }

  // are there any validation errors on the form
  get submitButtonDisabled() {
    return this.isUploading || !this.ccLicenseAccepted;
  }

  @action
  onSubmit(data: any, event: Event) {
    console.log(data);
    console.log(event);
    alert('shrimpoed successfully...');
    //this.router.transitionTo('home.shrimpo.show', data.slug);
  }

  @action
  onError() {
    alert("Couldn't save shrimpo entry...check the form for errors.");
  }

  @action
  uploadEntry(changeset: BufferedChangeset, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.isUploading = true;
        const validMimeTypes = ['audio/mp3', 'audio/mpeg'];
        if(!validMimeTypes.includes(files.item(i)?.type as string)) {
          alert('Only mp3 is supported! sorry...');
          return;
        }

        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.uploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('audio', signedId);
          this.isUploading = false;
        });
      }
    }
  }

}
