import Ember from 'ember';

export default Ember.Component.extend({
  eventSources: ["http://datafruits.streampusher.com/scheduled_shows.json"],
  timezone: function(){
    return jstz.determine().name();
  },
  header: { left: 'prev,next today', center: 'title', right: 'month,basicWeek,basicDay'},

  actions: {
    goToEvent: function(calEvent){
      this.sendAction('showEvent', calEvent);
    },
  },
});
