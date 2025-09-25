import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import dayjs, { Dayjs } from 'dayjs';
import { BufferedChangeset } from 'ember-changeset/types';
interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {
  @service declare router: any;
  @service declare currentUser: any;
  @service declare intl: any;

  @tracked file: Blob | null = null;

  statusOptions = {
    Published: 'archive_published',
    Unpublished: 'archive_unpublished',
  };

  @action deleteFile(changeset: BufferedChangeset) {
    if (changeset.get('image')) {
      changeset.set('image', '');
    }

    if (changeset.get('thumbImageUrl')) {
      changeset.set('thumbImageUrl', '');
    }
  }
  @tracked isUploading: boolean = false;

  @action
  onStartUpload() {
    this.isUploading = true;
  }

  @action
  onFinishUpload() {
    this.isUploading = false;
  }

  @action updateFile(e: any) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - only allow images
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert(this.intl.t('profile.my-shows.form.invalid-file-type'));
      e.target.value = ''; // Clear the input
      return;
    }

    this.file = file;
    this.args.episode.imageFilename = file.name;
    const reader = new FileReader();

    reader.onload = (e) => {
      this.args.episode.image = e.target?.result as string;
    };
    reader.onerror = (e) => {
      console.log('error reading file');
      console.log(e);
    };

    reader.readAsDataURL(this.file as Blob);
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
}
