import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import type ShowSeriesModel from 'datafruits13/models/show-series';

interface ShowCardArgs {
  showSeries: ShowSeriesModel;
}

export default class ShowCardComponent extends Component<ShowCardArgs> {
  get backgroundStyle() {
    let image;
    const show = this.args.showSeries;
    if (show.thumbImageUrl) {
      image = show.thumbImageUrl;
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
