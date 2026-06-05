import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface MyShowsEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeCard extends Component<MyShowsEpisodeCardArgs> {
  get backgroundStyle() {
    const image = this.args.episode.imageOrDefault;
    return htmlSafe(`background-image: url('${image}');`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MyShowsEpisodeCard: typeof MyShowsEpisodeCard;
  }
}
