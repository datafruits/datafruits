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

  // Mirrors the backend next_level formula (streampusher-api/app/models/user/rpg.rb)
  nextLevelThreshold(level) {
    if (level === 0) return 32;
    if (level === 1) return 500;
    return 500 * Math.pow(level, 2) - 500 * level;
  }

  // Returns the XP at which the current level began (= next_level threshold for level - 1)
  get currentLevelStartXp() {
    const level = this.currentUser.user?.level || 0;
    if (level <= 0) return 0;
    return this.nextLevelThreshold(level - 1);
  }

  get progress() {
    const xp = this.experiencePoints;
    const needed = this.xpNeededForNextLevel;
    const levelStart = this.currentLevelStartXp;
    // next_level threshold = experience_points + xp_needed_for_next_level
    const levelEnd = xp + needed;
    const range = levelEnd - levelStart;
    if (range <= 0) return 0;
    return Math.min(100, Math.round(((xp - levelStart) / range) * 100));
  }
}
