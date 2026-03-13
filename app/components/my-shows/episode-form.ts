import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from 'datafruits13/config/environment';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import dayjs, { Dayjs } from 'dayjs';
import { BufferedChangeset } from 'ember-changeset/types';
import EpisodeValidations from '../../validations/episode';
interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {
  @service declare router: any;
  @service declare currentUser: any;
  @service declare intl: any;
  @service declare activeStorage: any;

  EpisodeValidations = EpisodeValidations;

  @tracked imagePreview: string | null = null;

  @tracked imageUploadProgress = 0;

  statusOptions = {
    Published: 'archive_published',
    Unpublished: 'archive_unpublished',
  };

  @tracked isUploading: boolean = false;

  @tracked trackOption: string = 'upload';

  @action
  onStartUpload() {
    this.isUploading = true;
  }

  @action
  onFinishUpload() {
    this.isUploading = false;
  }

  @action updateFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const files = inputElement.files;
    if (files) {
      const file = files[0];
      // Validate file type - only allow images
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        alert(this.intl.t('profile.my-shows.form.invalid-file-type'));
        (event.target as HTMLInputElement).value = ''; // Clear the input
        return;
      }

      const directUploadURL = `${ENV.API_HOST}/rails/active_storage/direct_uploads`;

      for (let i = 0; i < files.length; i++) {
        this.activeStorage
        .upload(files.item(i), directUploadURL, {
          onProgress: (progress: any) => {
            this.imageUploadProgress = progress;
          },
        })
        .then((blob: any) => {
          const signedId = blob.signedId;

          this.args.episode.image = signedId;
        });
      }
    }
  }

  @action
  onSubmit(result: any) {
    this.router.transitionTo('home.shows.episode', result);
  }

  @action
  onError() {
    console.log(this.intl.t('profile.my-shows.form.save-error'));
  }

  @action
  deleteEpisode() {
    if (confirm(this.intl.t('profile.my-shows.form.confirm-delete'))) {
      this.args.episode.destroyRecord().then(() => {
        alert(this.intl.t('profile.my-shows.form.episode-deleted'));
        //redirect to /my-shows
        this.router.transitionTo('home.user.my-shows');
      });
    }
  }

  @action
  setEndAfterStart(startTime: Dayjs, changeset: BufferedChangeset) {
    if (startTime.hour() > dayjs(changeset.get('endAt')).hour()) {
      console.log('setting end time to: ', startTime.add(1, 'hour').hour());
      changeset.set('endTime', startTime.add(1, 'hour'));
    }
  }

  @action
  selectTrackOption(option: 'upload' | 'track'): void {
    this.trackOption = option;
 }

 get imagePreviewSrc(): string | null {
   if(this.imagePreview) {
     return this.imagePreview;
   } else if(this.args.episode.thumbImageUrl) {
     return this.args.episode.thumbImageUrl;
   } else {
     return null;
   }
 }
}
