import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr()
  username;

  @attr()
  email;

  @attr()
  password;

  @attr()
  role;

  @attr()
  avatarUrl;

  @hasMany('user-follow')
  userFollows;

  @attr('file')
  avatar;

  @attr()
  avatarFilename;

  @attr()
  style;

  @attr()
  pronouns;

  followingUser(user) {
    return this.userFollows.includes(user);
  }
}
