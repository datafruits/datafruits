import Ember from 'ember';

export default Ember.Component.extend({
  goToEvent: function(calEvent, jsEvent, view){
    this.sendAction('showEvent', calEvent);
  },
  setupCalendar: function(){
    var timeZone = jstz.determine();

    Ember.$('#calendar').fullCalendar({
      header: { left: 'prev,next today', center: 'title', right: 'month,basicWeek,basicDay'},
      defaultView: 'month',
      timezone: timeZone.name(),
      editable: false,
      eventSources: ["http://datafruits.streampusher.com/scheduled_shows.json"],
      eventClick: (calEvent, jsEvent, view) => {
        this.goToEvent(calEvent, jsEvent, view);
      }
    });
  }.on('didInsertElement')
});
