import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    showEvent: function(show){
      this.transitionTo('show', show);
    },

    calendarAddOccurrence: function(occurrence) {
    },

    calendarUpdateOccurrence: function(occurrence, properties, isPreview) {
    },

    calendarRemoveOccurrence: function(occurrence) {
    }
  }
});
