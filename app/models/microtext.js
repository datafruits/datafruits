import Model, { attr } from '@ember-data/model';

export default class Microtext extends Model {
  @attr
  content;

  @attr
  username;

  @attr
  avatarUrl;
}
