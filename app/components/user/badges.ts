import Component from '@glimmer/component';

interface UserBadgesArgs {
  role: string;
}

export default class UserBadges extends Component<UserBadgesArgs> {
  validBadges = ['dj', 'supporter'];

  get badges() {
    const roles = this.args.role.split(" ");
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
  }
}
