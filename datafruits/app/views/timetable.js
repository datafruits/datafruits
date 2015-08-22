import Ember from 'ember';

export default Ember.View.extend({
  setupCalendar: function(){
    var timeZone = jstz.determine();

    $('#calendar').fullCalendar({
      header: { left: 'prev,next today', center: 'title', right: 'month,basicWeek,basicDay'},
      defaultView: 'month',
      timezone: timeZone.name(),
      editable: true,
      eventSources: ["http://datafruits.streampusher.com/scheduled_shows.json"],
      eventClick: function(calEvent, jsEvent, view) {
        $("#eventModal h1").html("");
        $("#eventModal h2").html("");
        $("#eventModal .start-time").html("");
        $("#eventModal .end-time").html("");
        $("#eventModal .event-image").html("");

        $("#timetableModal").modal('hide');
        $("#eventModal h1").html(calEvent.title);
        $("#eventModal h2").html(calEvent.dj.username);
        $("#eventModal .start-time").html(calEvent.start.tz(timeZone.name()).format("ha z"));
        $("#eventModal .end-time").html(calEvent.end.tz(timeZone.name()).format('ha z'));
        var image = new Image();
        image.src = calEvent.image_url;
        $("#eventModal .event-image").append($(image));
        $("#eventModal").modal('show');
      }
    });
  }.on('didInsertElement')
});
