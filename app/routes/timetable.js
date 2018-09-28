import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    // return fetch('https://datafruits.streampusher.com/scheduled_shows.json?start=2017-08-27&end=2017-10-08&timezone=Asia%2FTokyo&_=1505527326508')
    // .then(function(response){
    //   return response.json();
    // });
    let start = moment().startOf('month').startOf('week').format('YYYY-MM-DD');
    let end = moment().endOf('month').endOf('week').format('YYYY-MM-DD');

    let query = {
      start: start,
      end: end,
      //timezone: this.get('timezone').getTimezone()
      timezone: "Asia/Tokyo"
    };
    this.store.query('scheduled-show', query).then((shows) => {
      return shows;
    });
  },
  actions: {
    showEvent: function(show){
      this.transitionTo('show', show);
    }
  }

});
