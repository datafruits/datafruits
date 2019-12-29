/* eslint ember/no-observers: 0 */
import LazyImage from 'ember-lazy-image/components/lazy-image'
import { observer } from '@ember/object';

export default LazyImage.extend({
  adjustScrollingIfImageLoaded: observer('loaded', function(){
    if(this.loaded === true){
      this.adjustScrolling();
    }
  })
});
