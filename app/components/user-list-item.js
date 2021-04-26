import Component from '@glimmer/component';

export default class UserListItem extends Component {
  get avatarUrl(){
    return this.args.user.metas[0].avatarUrl;
  }

  get username(){
    return this.args.user.metas[0].username;
  }
}
