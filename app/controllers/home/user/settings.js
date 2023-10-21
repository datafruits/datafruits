import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class HomeUserSettingsController extends Controller {
  @service
  currentUser;

  greetings = [
    '你好',
    'hello',
    'hej',
    'hei',
    "hola",
    "bonjour",
    "ciao",
    // totally not from chat GPT
    "guten tag",       // german
    "olá",             // portuguese
    "namaste",         // hindi
    "szia",            // hungarian
    "zdravo",          // serbian
    "merhaba",         // turkish
    "dobrý den",       // czech
    "hallo",           // dutch
    "shalom",          // hebrew
    "salam",           // arabic
    "kamusta",         // filipino
    "zdravstvuyte",    // russian
    "jambo",           // swahili
    "kia ora",         // maori
    "こんにちは",
    "مرحبًا",
    "안녕하세요",
    "ʔi, ti dsyaʔyaʔ." // duwamish
  ]
  get randomGreeting() {
    return this.greetings[Math.floor(Math.random() * this.greetings.length)];
  }

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
    'layzee',
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
  setTimezone(timeZone) {
    this.currentUser.user.timeZone = timeZone;
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
