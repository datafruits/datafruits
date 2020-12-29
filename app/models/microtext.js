import Model, { attr } from '@ember-data/model';
import { isEmpty } from '@ember/utils';

export default class Microtext extends Model {
  @attr
  content;

  @attr
  username;

  @attr
  avatarUrl;

  get avatarUrlOrDefault() {
    if (isEmpty(this.avatarUrl)) {
      return '/assets/images/show_placeholder.jpg';
    } else {
      return this.avatarUrl;
    }
  }
}
