import Component from '@glimmer/component';
import ShrimpoEntryValidations from '../../validations/shrimpo-entry';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { BufferedChangeset } from 'ember-changeset/types';
import type ShrimpoEntry from 'datafruits13/models/shrimpo-entry';
import ENV from 'datafruits13/config/environment';

interface ShrimpoEntryUploaderArgs {}

export default class ShrimpoEntryUploader extends Component<ShrimpoEntryUploaderArgs> {
  ShrimpoEntryValidations = ShrimpoEntryValidations

  @service declare activeStorage: any;
  @service declare store: any;
  @tracked uploadProgress = 0;

  @tracked entry: ShrimpoEntry;

  constructor(owner: unknown, args: any) {
    super(owner, args);
    this.entry = this.store.createRecord('shrimpo-entry');
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
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.uploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          changeset.set('audioFile', signedId);
        });
      }
    }
  }

}
