import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';
import { htmlSafe } from '@ember/template';

interface ShowEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class ShowEpisodeCard extends Component<ShowEpisodeCardArgs> {
  get backgroundStyle() {
    const image = this.args.episode.imageOrDefault;
    return htmlSafe(`background-image: url('${image}');`);
  }
}
