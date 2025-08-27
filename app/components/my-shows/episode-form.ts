import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import dayjs, { Dayjs } from "dayjs";
import { BufferedChangeset } from 'ember-changeset/types';

interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {
  @service declare router: any;
  @service declare currentUser: any;

  file: Blob | null = null;

  statusOptions = {
    "Published": "archive_published",
    "Unpublished": "archive_unpublished"
  };

  @tracked isUploading: boolean = false;

  @action
  onStartUpload() {
    this.isUploading = true;
  }

  @action
  onFinishUpload() {
    this.isUploading = false;
  }

  @action updateFile(e: any){
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type - only allow images
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      alert('Only image files (JPEG, PNG, GIF, WebP) are allowed for artwork!');
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
    console.log('couldnt ssave show');
  }

  @action
  deleteEpisode() {
    if(confirm("Are you sure?!!!")) {
      this.args.episode.destroyRecord().then(() => {
        alert("Goodbye episode. :(");
        //redirect to /my-shows
        this.router.transitionTo('home.user.my-shows');
      });
    }
  }

  @action
  setEndAfterStart(startTime: Dayjs, changeset: BufferedChangeset) {
    if(startTime.hour() > dayjs(changeset.get('endAt')).hour()) {
      console.log('setting end time to: ', startTime.add(1, 'hour').hour());
      changeset.set('endTime', startTime.add(1, 'hour'));
    }
  }
}
