import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ChatLazyImage extends Component {
  @action
  didInsert(element) {
    let img = element.querySelector('img');
    if (img.complete) {
      this.args.adjustScrolling();
    } else {
      img.addEventListener('load', this.args.adjustScrolling);
      img.addEventListener('error', function () {
        console.log('error');
      });
    }
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ChatLazyImage: typeof ChatLazyImage;
  }
}
  
