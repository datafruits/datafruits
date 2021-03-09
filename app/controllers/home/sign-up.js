import Controller from '@ember/controller';
import UserValidations from '../../validations/user';
import { inject as service } from '@ember/service';

export default class HomeSignUpController extends Controller {
  UserValidations = UserValidations;

  @service currentUser;
}
