import Ember from 'ember';

export default Ember.Component.extend({
  eventSources: ["https://datafruits.streampusher.com/scheduled_shows.json"],
  timezone: function(){
    return jstz.determine().name();
  },
  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay'
  },
  nowIndicator: true,

  actions: {
    goToEvent: function(calEvent){
      this.sendAction('showEvent', calEvent);
    },
  },
});
