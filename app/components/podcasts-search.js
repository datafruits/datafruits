import Ember from 'ember';

export default Ember.Component.extend({
  filterText: '',
  isSearching: Ember.computed('filterText', function() {
    return this.get('filterText') !== "";
  }),
  filteredResults: Ember.computed('filterText', function() {
    let filter = this.get('filterText');
    return this.get('podcasts').filter(function(item) {
      return item.title.toLowerCase().indexOf(filter) !== -1;
    });
  }),
  actions: {
    clearSearch() {
      this.set('filterText', '');
    }
  }
});
