import Component from '@ember/component';
import { observer } from '@ember/object';
import { debounce } from '@ember/runloop';

export default Component.extend({
  observeQuery: observer('searchTerm', function(){
    debounce(this, () => {
      this.set('query', this.searchTerm)
    }, 500);
  }),
});
