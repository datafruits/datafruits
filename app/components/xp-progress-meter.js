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
    const xp = this.experiencePoints;
    const needed = this.xpNeededForNextLevel;
    const total = xp + needed;
    if (total === 0) return 0;
    return Math.min(100, Math.round((xp / total) * 100));
  }
}
