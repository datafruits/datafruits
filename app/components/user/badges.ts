import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

interface UserBadgesSignature {
  Args: {
    role: string;
  };
}

interface Badge {
  name: string | string[];
  url: string;
  description: string;
}

export default class UserBadges extends Component<UserBadgesSignature> {
  @service declare intl: any;

  validBadges = ['dj', 'vj', 'supporter', 'emerald_supporter', 'gold_supporter', 'strawberry', 'lemon', 'orange', 'watermelon', 'banana', 'cabbage', 'pineapple', 'duckle'];
  descriptions: any;

  constructor(owner: unknown, args: UserBadgesSignature['Args']) {
    super(owner, args);
    this.descriptions = {
      'dj': this.intl.t('profile.badges.dj'),
      'vj': this.intl.t('profile.badges.vj'),
      'supporter': this.intl.t('profile.badges.supporter'),
      'strawberry': this.intl.t('profile.badges.strawberry'),
      'lemon': this.intl.t('profile.badges.lemon'),
      'orange': this.intl.t('profile.badges.orange'),
      'watermelon': this.intl.t('profile.badges.watermelon'),
      'cabbage': this.intl.t('profile.badges.cabbage'),
      'pineapple': this.intl.t('profile.badges.pineapple'),
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
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserBadges: typeof UserBadges;
  };;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
}

