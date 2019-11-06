import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { debounce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';

/* eslint-disable ember/no-observers */

export default Component.extend({
  init(){
    this._super(...arguments);
    this.selectedLabels = [];
    const selectedTags = this.selectedTags;
    if(!isEmpty(selectedTags)){
      if(isArray(selectedTags)){
        this.set('selectedLabels', this.selectedTags);
      }else{
        this.set('selectedLabels', this.selectedTags.split(","));
      }
    }
    const searchParams = this.searchParams;
    if(searchParams.query){
      this.set('filterText', searchParams.query);
    }
  },
  filterText: '',
  labelNames: computed('labels', function(){
    return this.labels.map(function(label){
      return label.get('name');
    });
  }),
  observeQuery: observer('filterText', function(){
    debounce(this, () => {
      this.updateSearch(this.filterText, this.selectedLabels);
    }, 500);
  }),
  observeLabels: observer('selectedLabels.[]', function(){
    debounce(this, () => {
      this.updateSearch(this.filterText, this.selectedLabels);
    }, 100);
  }),
  actions: {
    clearSearch() {
      this.set('filterText', '');
    },
    selectLabel(label) {
      this.selectedLabels.pushObject(label.get('name'));
    },
  }
});
