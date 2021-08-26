import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ChatLazyImage extends Component {
  adjustScrollingIfImageLoaded() {
    this.args.adjustScrolling();
  }

  @action
  didInsert(element) {
    console.log('inserted image');
    let img = element.querySelector('img');
    console.log(img);
    if (img.complete) {
      this.adjustScrollingIfImageLoaded();
    } else {
      img.addEventListener('load', this.adjustScrollingIfImageLoaded);
      img.addEventListener('error', function () {
        alert('error');
      });
    }
  }
}
