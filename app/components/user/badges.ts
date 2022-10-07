import Component from '@glimmer/component';

interface UserBadgesArgs {
  role: string;
}

interface Badge {
  name: string | string[];
  url: string;
}

export default class UserBadges extends Component<UserBadgesArgs> {
  validBadges = ['dj', 'supporter'];

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
            url: `/assets/images/badges/${badge}.webp`
          };
        });
    } else {
      return undefined;
    }
  }
}
