import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class ShowCardComponent extends Component {
  get backgroundStyle() {
    let image;
    const show = this.args.show;
    if (show.thumbImageUrl) {
      image = show.thumbImageUrl;
    } else if (show.isGuest) {
      image = '/assets/images/show_placeholder.jpg';
    } else if (show.host.imageUrl) {
      image = show.host.imageUrl;
    } else {
      image = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${image}');`);
  }
}
