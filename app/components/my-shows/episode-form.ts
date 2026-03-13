import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import dayjs, { Dayjs } from 'dayjs';

import { object, string } from 'yup';

interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {
  schema = object({
    title: string().required(),
    description: string().required(),
  });

  @service declare router: any;
  @service declare currentUser: any;
  @service declare intl: any;

  @tracked imagePreview: string | null = null;

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

  @action updateFile(input: any, e: any) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - only allow images
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert(this.intl.t('profile.my-shows.form.invalid-file-type'));
      e.target.value = ''; // Clear the input
      return;
    }

    this.args.episode.imageFilename = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.args.episode.image = e.target?.result as string;
    };
    reader.onerror = (e) => {
      console.log('error reading file');
      console.log(e);
    };

    reader.readAsDataURL(file as Blob);
  }

  @action
  async onSubmit(data: Partial<ScheduledShow>) {
    const episode = this.args.episode;
    Object.entries(data).forEach(([key, value]) => {
      episode.set(key as keyof ScheduledShow, value);
    });
    await episode.save();
    this.router.transitionTo('home.shows.episode', episode);
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
  setEndAfterStart(startTime: Dayjs, model: ScheduledShow) {
    if (startTime.hour() > dayjs(model.get('end')).hour()) {
      console.log('setting end time to: ', startTime.add(1, 'hour').hour());
      model.set('end', startTime.add(1, 'hour').toISOString());
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
