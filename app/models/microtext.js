import { Model, attr } from '../../framework/index.js';

function isEmpty(val) {
  return val === null || val === undefined || val === '';
}

export default class Microtext extends Model {
  @attr
  content;

  @attr
  username;

  @attr
  avatarUrl;

  @attr
  createdAt;
  
  get avatarUrlOrDefault() {
    if (isEmpty(this.avatarUrl)) {
      return '/assets/images/show_placeholder.jpg';
    } else {
      return this.avatarUrl;
    }
  }
}
