import Component from '@ember/component';

export default Component.extend({
  actions: {
    calendarRemoveOccurrence(){},
    calendarEditOccurrence(){},
    calendarUpdateOccurrence(){},
    calendarAddOccurrence(){},
    calendarClickOccurrence(){},
    onTypeChange(){},
    calendarNavigate(event){
      console.log(`on navigate: ${event.start}, ${event.end}`); // eslint-disable-line no-console
      let start = event.start.format('YYYY-MM-DD');
      this.reloadCalendar({ start: start, view: event.view});
    }
  }
});
