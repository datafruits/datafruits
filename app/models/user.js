import Model, { attr } from '@ember-data/model';

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
}
