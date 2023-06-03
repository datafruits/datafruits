import Component from '@glimmer/component';
import type ScheduledShow from 'datafruits13/models/scheduled-show';

interface ShowEpisodeCardArgs {
  episode: ScheduledShow;
}

export default class ShowEpisodeCard extends Component<ShowEpisodeCardArgs> {}
