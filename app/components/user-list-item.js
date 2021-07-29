import Component from '@glimmer/component';

export default class UserListItem extends Component {
  get avatarUrl() {
    console.log(this.args.user.metas);
    return this.args.user.metas[0].avatarUrl;
  }

  get username() {
    return this.args.user.metas[0].username;
  }

  get role() {
    console.log('metas');
    console.log(this.args.user);
    return this.args.user.metas[0].role;
  }

  get isDj() {
    let role = this.args.user.metas[0].role;
    if (!role) return false;
    return this.message.role.includes('dj') || this.message.role.includes('admin');
  }
}
