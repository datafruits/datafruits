import Ember from 'ember';

export default Ember.Component.extend({
  eventSources: [
    {
      url: "https://datafruits.streampusher.com/scheduled_shows.json",
      data: {
        fullcalendar: true
      }
    }
  ],

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
