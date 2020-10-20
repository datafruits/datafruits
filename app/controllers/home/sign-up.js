import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class HomeSignUpController extends Controller {
  @action
  submit() {
    let user = this.model;
    user.save().then(() => {
      //login user then transition to chat ??
    });
  }
}
