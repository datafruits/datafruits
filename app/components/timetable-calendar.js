import Component from '@ember/component';

export default Component.extend({
  eventSources: [
    {
      url: "https://datafruits.streampusher.com/scheduled_shows.json",
      data: {
        fullcalendar: true
      }
    }
  ],
});
