import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class XpProgressMeter extends Component {
  @service currentUser;

  get experiencePoints() {
    return this.currentUser.user?.experiencePoints || 0;
  }

  get xpNeededForNextLevel() {
    return this.currentUser.user?.xpNeededForNextLevel || 1;
  }

  get progress() {
    return this.currentUser.user?.xpProgressPercentage;
  }
}
