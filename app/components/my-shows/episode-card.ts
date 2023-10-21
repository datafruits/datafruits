import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface MyShowsEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class MyShowsEpisodeCard extends Component<MyShowsEpisodeCardArgs> {
  get backgroundStyle() {
    let image;
    const show = this.args.episode;
    if (show.imageUrl) {
      image = show.imageUrl;
    // } else if (show.isGuest) {
    //   image = '/assets/images/show_placeholder.jpg';
    // } else if (show.host && show.host.imageUrl) {
    //   image = show.host.imageUrl;
    } else {
      image = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${image}');`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    MyShowsEpisodeCard: typeof MyShowsEpisodeCard;
  }
}
