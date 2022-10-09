import Component from '@glimmer/component';

interface UserBadgesArgs {
  role: string;
}

interface Badge {
  name: string | string[];
  url: string;
  description: string;
}

export default class UserBadges extends Component<UserBadgesArgs> {
  validBadges = ['dj', 'supporter'];

  descriptions: any = {
    'dj': 'plays the music on the website',
    'supporter': 'supports the website on patreon or ampled'
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
