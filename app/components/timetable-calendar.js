import Component from '@ember/component';

export default Component.extend({
  actions: {
    calendarNavigate(event){
      //view start end dir
      console.log(`on navigate: ${event.start}, ${event.end}`);
      const view = event.view
      // if(view === "week"){
      // }else if(view === "month"){
      // }else if (view === "day"){
      // }
      let start = event.start.startOf('month').startOf('week').format('YYYY-MM-DD');
      let end = event.end.endOf('month').endOf('week').format('YYYY-MM-DD');
      this.get('reloadCalendar')({ start: start, end: end, view: view});
    }
  }
});
