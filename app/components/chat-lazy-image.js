import classic from 'ember-classic-decorator';
import { observes } from '@ember-decorators/object';
/* eslint ember/no-observers: 0 */
import LazyImage from 'ember-lazy-image/components/lazy-image'
import '@ember/object';

@classic
export default class ChatLazyImage extends LazyImage {
  @observes('loaded')
  adjustScrollingIfImageLoaded() {
    if(this.loaded === true){
      this.adjustScrolling();
    }
  }
}
