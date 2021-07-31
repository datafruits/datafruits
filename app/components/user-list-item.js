import Component from '@glimmer/component';

export default class UserListItem extends Component {
  get avatarUrl() {
    return this.args.user.metas[0].avatarUrl;
  }

  get username() {
    return this.args.user.metas[0].username;
  }

  get role() {
    return this.args.user.metas[0].role;
  }

  get style() {
    return this.args.user.metas[0].style;
  }

  get pronouns() {
    return this.args.user.metas[0].pronouns;
  }

  get isDj() {
    let role = this.args.user.metas[0].role;
    if (!role) return false;
    return this.message.role.includes('dj') || this.message.role.includes('admin');
  }
}
