import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

interface ShrimpoCountdownArgs {
  endAt: string;
}

export default class ShrimpoCountdown extends Component<ShrimpoCountdownArgs> {
  @tracked elapsedTimeSeconds = 0;

  get currentTimeLeft() {
    const timeLeftMs = (new Date(this.args.endAt).getTime()) - this.elapsedTimeSeconds;
    //console.log(timeLeftMs);
    const now = new Date();
    const days = Math.floor((timeLeftMs - now.getTime()) / (1000 * 3600 * 24));
    const hours = Math.floor((timeLeftMs - now.getTime()) / (1000 * 3600) % 24);
    const minutes = Math.floor(((timeLeftMs - now.getTime()) / 1000 / 60)  % 60);
    const seconds = Math.floor(((timeLeftMs - now.getTime()) / 1000) % 60);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  }

  incTime() {
    //console.log('in incTime');
    this.elapsedTimeSeconds += 1000;
    later(() => {
      this.incTime();
    }, 1000);
  }

  constructor(owner: unknown, args: any) {
    super(owner, args);
    //setTimeout(this.incTime, 1000);
    later(() => {
      this.incTime();
    }, 1000);
  }
}
