import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HomeUserSettingsController extends Controller {
  @service
  currentUser;

  availableStyles = [
    'unknown',
    'cold',
    'gooey',
    'party',
    'doom',
    'funky',
    'fruity',
    'sadness',
    'grumpy',
    'sexy',
    'chill',
    'freaky',
    'fancy',
  ];

  @action setUserStyle(style) {
    this.currentUser.user.style = style;
  }

  @action saveUser(e) {
    e.preventDefault();
    this.currentUser.user
      .save()
      .then(() => {
        console.log('saved user!'); // eslint-disable-line no-console
        alert('updated your profile!');
      })
      .catch((error) => {
        console.log(error); // eslint-disable-line no-console
        alert('couldnt save user!');
      });
  }
}
