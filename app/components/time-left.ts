import Component from '@glimmer/component';

interface TimeLeftArgs {
  endAt: string; 
}

export default class TimeLeft extends Component<TimeLeftArgs> {
  // @tracked currentValue;
  // @(task(function* (query) {
  //   while (! this.get('countdownFinished')) {
  //     currentValue = currentValue - 1;
  //     yield timeout(1000);
  //   }
  // }))
  // countdown;
}
