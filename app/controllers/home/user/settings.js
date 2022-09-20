import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HomeUserSettingsController extends Controller {
  @service
  currentUser;

  availableStyles = [
    'funny',
    'gooey',
    'party',
    'fruity',
    'prickly',
    'cold',
    'goofy',
    'funky',
    'freaky',
    'fishy',
    'undefined',
    'chunky',
    'doom',
    'sleepy',
    'thinking',
    'slimey',
    'pokey',
    'grumpy',
    'fancy',
    'sexy',
    'sadness',
    'chill',
    'lazy',
    'unknown',
  ];

  @action
  updateFile(e) {
    // this.currentUser.user.avatar.update(e.target.files[0]);
    // this.currentUser.user.avatarFilename = e.target.files[0].name;

    this.file = e.target.files[0];
    this.currentUser.user.avatarFilename = e.target.files[0].name;
    let reader = new FileReader();

    reader.onload = (e) => {
      this.currentUser.user.avatar = e.target.result;
    };
    reader.onerror = (e) => {
      console.log('error reading file');
      console.log(e);
    };

    reader.readAsDataURL(this.file);
  }

  @action
  setUserStyle(style) {
    this.currentUser.user.style = style;
  }

  @action
  saveUser(e) {
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
