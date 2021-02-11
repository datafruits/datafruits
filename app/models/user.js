import Model, { attr, hasMany } from '@ember-data/model';

export default class UserModel extends Model {
  @attr()
  username;

  @attr()
  role;

  @attr()
  avatarUrl;

  @hasMany('userFollows')
  userFollow;
}
