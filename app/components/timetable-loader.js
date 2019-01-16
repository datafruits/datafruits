import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default Component.extend({
  store: service(),
  tagName: '',
  init() {
    this._super(...arguments);
    this.data = [];
  },

  didReceiveAttrs() {
    let query = this.get('query');
    this.get('fetchData').perform(query);
  },

  fetchData: task(function*(query) {
    if(document.getElementsByClassName("as-calendar-timetable__main").length){
      document.getElementsByClassName("as-calendar-timetable__main")[0]
        .classList.add('bleed')
    }
    yield timeout(1000);
    query.timezone = jstz.determine().name();
    const start = query.start;
    if(query.view === 'month'){
      query.start = moment(start).startOf('month').format('YYYY-MM-DD');
      query.end = moment(start).endOf('month').format('YYYY-MM-DD');
    }else{
      query.start = moment(start).startOf('week').format('YYYY-MM-DD');
      query.end = moment(start).endOf('week').format('YYYY-MM-DD');
    }
    let shows = this.store.query('scheduled-show', query).then((shows) => {
      return shows;
    });
    let resolvedShows = yield shows;
    document.getElementsByClassName("as-calendar-timetable__main")[0]
      .classList.remove('bleed')
    return this.set('data', resolvedShows);
  }).restartable()
});
