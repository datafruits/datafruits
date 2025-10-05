import Component from '@glimmer/component';
import ENV from 'datafruits13/config/environment';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import type { BufferedChangeset } from 'ember-changeset/types';
//import type { UploadFile } from 'ember-file-upload/upload-file';

interface TrackUploaderArgs {
  changeset: BufferedChangeset;
  onStartUpload: () => void | null;
  onFinishUpload: () => void | null;
}

export default class TrackUploader extends Component<TrackUploaderArgs> {
  @service declare store: any;
  @service declare session: any;

  signingUrl = `${ENV.API_HOST}/uploader_signature`;

  validMimeTypes = ['audio/mp3', 'audio/mpeg'];

  @action
  uploadTrack(file: any) {
    window.onbeforeunload = function (e) {
      const dialogText =
        'You are currently uploading files. Closing this tab will cancel the upload operation! Are you sure you want to close this tab?';
      e.returnValue = dialogText;
      return dialogText;
    };
    if (typeof this.args.onStartUpload == 'function') {
      this.args.onStartUpload();
    }

    if (!this.validMimeTypes.includes(file.type)) {
      alert('Only mp3 is supported! sorry...');
      return;
    }

    const track = this.store.createRecord('track', {
      isUploading: true,
      audioFileName: file.name,
      filesize: file.size,
    });
    let mimeType;
    if (file.type == 'audio/mp3') {
      mimeType = 'audio/mpeg';
    } else {
      mimeType = file.type;
    }

    const headers = {
      'Content-Type': mimeType,
      'x-amz-acl': 'public-read',
    };
    const params = {
      name: file.name.toString(),
      size: file.size.toString(),
      type: file.type.toString(),
    };
    const searchParams = new URLSearchParams(Object.entries(params)).toString();
    fetch(`${this.signingUrl}?${searchParams}`, {
      headers: {
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        track.set('audioFileName', data.endpoint.split('?')[0]);
        return file.uploadBinary(data.endpoint, {
          method: 'PUT',
          headers: headers,
        });
      })
      .then((response) => {
        console.log(`uploaded: ${response}`);
        console.log(response);
        track.set('isUploading', false);
        if (typeof this.args.onFinishUpload == 'function') {
          this.args.onFinishUpload();
        }
        track
          .save()
          .then(() => {
            console.log('track saved!');
            console.log(track);
            //this.flashMessages.success('Track uploaded!');
            window.onbeforeunload = null;
            this.args.changeset.set('prerecordTrackId', track.id);
            this.args.changeset.set(
              'prerecordTrackFilename',
              track.audioFileName
            );
          })
          .catch((reason: any) => {
            console.log(`track save failed: ${reason}`);
            //this.flashMessages.danger(
            //   'Sorry, something went wrong uploading this file!'
            // );
            window.onbeforeunload = null;
          });
      })
      .catch((error: any) => {
        console.log(`error: ${error}`);
        window.onbeforeunload = null;
      });
  }
}
