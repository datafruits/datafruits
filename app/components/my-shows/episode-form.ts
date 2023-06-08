import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface MyShowsEpisodeFormArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeForm extends Component<MyShowsEpisodeFormArgs> {
  @service declare router: any;

  file: Blob | null = null;

  @action updateFile(e: any){
    this.file = e.target.files[0];
    this.args.episode.imageFilename = e.target.files[0].name;
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
  onSubmit(result: any, event: any) {
    console.log(result);
    console.log(event);
    this.router.transitionTo('home.shows.episode', result);
  }

  @action
  onError() {
    console.log('couldnt ssave show');
  }
}
