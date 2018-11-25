import Component from '@ember/component';
import { computed } from '@ember/object';
import _ from 'lodash';

export default Component.extend({
  init(){
    this._super(...arguments);
    this.selectedLabels = [];
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
  filteredResults: computed('filterText', 'selectedLabels.[]', function() {
    let filter = this.filterText;
    let labels = this.selectedLabels;
    return this.tracks.filter(function(track) {
      if(labels.length != 0){
        if(_.intersection(track.get('labelNames'), labels).length == labels.length){
          return track.get('title').toLowerCase().indexOf(filter) !== -1;
        }else {
          return false;
        }
      }
      return track.get('title').toLowerCase().indexOf(filter) !== -1;
    });
  }),
  actions: {
    clearSearch() {
      this.set('filterText', '');
    },
    selectLabel(label) {
      this.selectedLabels.addObject(label.get('name'));
      this.set('page', 1);
    },
    resetPagination(){
      this.set('page', 1);
    }
  },
  queryParams: ["page"],
  page: 1,
});
