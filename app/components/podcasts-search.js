import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { debounce } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import _ from 'lodash';

export default Component.extend({
  init(){
    this._super(...arguments);
    this.selectedLabels = [];
    const selectedTags = this.get('selectedTags');
    if(!isEmpty(selectedTags)){
      if(isArray(selectedTags)){
        this.set('selectedLabels', this.get('selectedTags'));
      }else{
        this.set('selectedLabels', this.get('selectedTags').split(","));
      }
    }
    const searchParams = this.get('searchParams');
    if(query){
      this.set('filterText', query);
    }
  },
  filterText: '',
  labelNames: computed('labels', function(){
    return this.labels.map(function(label){
      return label.get('name');
    });
  }),
  isSearching: computed('filterText', 'selectedLabels.[]', function() {
    return this.filterText !== "" || this.selectedLabels.length !== 0;
  }),
  observeQuery: observer('filterText', function(){
    debounce(this, () => {
      this.get('updateSearch')(this.get('filterText'), this.get('selectedLabels'));
    }, 500);
  }),
  observeLabels: observer('selectedLabels.[]', function(){
    debounce(this, () => {
      this.get('updateSearch')(this.get('filterText'), this.get('selectedLabels'));
    }, 100);
  }),
  actions: {
    clearSearch() {
      this.set('filterText', '');
    },
    // labelsChanged(label, labels){
    //   this.selectedLabels.pushObject(label);
    // },
    selectLabel(label) {
      this.selectedLabels.pushObject(label.get('name'));
      this.set('page', 1);
    },
    resetPagination(){
      this.set('page', 1);
    },
  },
  //queryParams: ["page"],
  page: 1,
});
