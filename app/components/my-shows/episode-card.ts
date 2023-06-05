import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface MyShowsEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeCard extends Component<MyShowsEpisodeCardArgs> {}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MyShowsEpisodeCard: typeof MyShowsEpisodeCard;
  }
}

