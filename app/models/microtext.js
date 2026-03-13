import Model, { attr } from '@ember-data/model';
import { isEmpty } from '@ember/utils';

export default class Microtext extends Model {
  @attr
  content;

  @attr
  username;

  @attr
  avatarUrl;

  @attr
  createdAt;
}
