import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

interface UserBadgesArgs {
  role: string;
}

interface Badge {
  name: string | string[];
  url: string;
  description: string;
}

export default class UserBadges extends Component<UserBadgesArgs> {
  @service declare intl: any;

  @tracked currentBadgeViewer: Badge | null = null;
  @tracked badgeViewerOpen: boolean = false;

  validBadges = ['dj', 'supporter', 'strawberry', 'lemon', 'orange', 'watermelon', 'banana'];
  descriptions: any;

  constructor(owner: unknown, args: UserBadgesArgs) {
    super(owner, args);
    this.descriptions = {
      'dj': this.intl.t('profile.badges.dj'),
      'supporter': this.intl.t('profile.badges.supporter')
    };
  }

  get badges(): Badge[] | undefined  {
    if(this.args.role.length) {
      let roles: string | string[];
      if(Array.isArray(this.args.role)) {
        roles = this.args.role;
      } else {
        roles = this.args.role.split(" ");
      }
      return this.validBadges
        .filter((badge) => {
          return roles.includes(badge);
        })
        .map((badge) => {
          return {
            name: badge,
            url: `/assets/images/badges/${badge}.webp`,
            description: this.descriptions[badge]
          };
        });
    } else {
      return undefined;
    }
  }

  @action
  showBadge(badge: Badge) {
    this.currentBadgeViewer = badge;
    this.badgeViewerOpen = true;
    console.log(badge);
  }

  @action
  closeBadgeViewer() {
    this.badgeViewerOpen = false;
  }
}
