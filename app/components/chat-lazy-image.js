/* eslint ember/no-observers: 0 */
import LazyImage from 'ember-lazy-image/components/lazy-image'
import { observer } from '@ember/object';

export default LazyImage.extend({
  adjustScrollingIfImageLoaded: observer('loaded', function(){
    console.log('in adjustScrollingIfImageLoaded');
    if(this.loaded === true){
      console.log('calling adjustScrolling');
      this.adjustScrolling();
    }
  })
});
