import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { htmlSafe } from '@ember/template';

interface ShowEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class ShowEpisodeCard extends Component<ShowEpisodeCardArgs> {
  get backgroundStyle() {
    let image;
    const show = this.args.episode;
    console.log(`this show ${show.formattedEpisodeTitle} image url: ${show.imageUrl}`);
    if (show.imageUrl) {
      image = show.imageUrl;
    } else {
      image = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${image}');`);
  }
}
