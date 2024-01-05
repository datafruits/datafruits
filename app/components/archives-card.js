import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class ArchivesCardComponent extends Component {
  get backgroundStyle() {
    let imageUrl;
    const image = this.args.image;
    if (image) {
      imageUrl = image;
    } else {
      imageUrl = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${imageUrl}');`);
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ArchivesCardComponent: typeof ArchivesCardComponent;
  }
}
  
