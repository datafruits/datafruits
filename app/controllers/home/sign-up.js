import Controller from '@ember/controller';
import UserValidations from '../../validations/user';

export default class HomeSignUpController extends Controller {
  UserValidations = UserValidations;
}
