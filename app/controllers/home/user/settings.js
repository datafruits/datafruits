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
    "kumusta",         // filipino
    "zdravstvuyte",    // russian
    "jambo",           // swahili
    "kia ora",         // maori
    "こんにちは",
    "안녕하세요",
    "ʔi, ti dsyaʔyaʔ.", // duwamish
    // https://github.com/novellac/multilanguage-hello-json/blob/master/hello.json#L26
    // Albanian
    "përshëndetje",
    // amharic
    "ሰላም",
    // arabic
    "مرحبا",
    // armenian
    "բարեւ",
    // azerbaijani
    "salam",
    // basque
    "kaixo",
    // belarusian
    "добры дзень",
    // bengali
    "হ্যালো",
    // bosnian
    "zdravo",
    // bulgarian
    "здравейте",
    // chichewa
    "moni",
    // corsican
    "bonghjornu",
    // croatian
    "zdravo",
    // czech
    "ahoj",
    // esperanto
    "saluton",
    // estonian
    "tere",
    // filipino
    "kumusta",
    // galician
    "ola",
    // georgian
    "გამარჯობა",
    // greek
    "γεια σας",
    // gujarati
    "હેલો",
    // haitian creole
    "bonjou",
    // hausa
    "sannu",
    // hawaiian
    "alohaʻoe",
    // hebrew
    "שלום",
    // hindi
    "नमस्ते",
    // hmong
    "nyob zoo",
    // icelandic
    "halló",
    // igbo
    "ndewo",
    // indonesian
    "halo",
    // irish
    "dia duit",
    // kannada
    "ಹಲೋ",
    // kazakh
    "сәлем",
    // khmer
    "ជំរាបសួរ",
    // kyrgyz
    "салам",
    // lao
    "ສະບາຍດີ",
    // latin
    "salve",
    // latvian
    "labdien!",
    // lithuanian
    "sveiki",
    // luxembourgish
    "moien",
    // macedonian
    "здраво",
    // malayalam
    "ഹലോ",
    // marathi
    "हॅलो",
    // mongolian
    "сайн байна уу",
    // myanmar (burmese)
    "မင်္ဂလာပါ",
    // nepali
    "नमस्ते",
    // pashto
    "سلام",
    // persian
    "سلام",
    // polish
    "cześć",
    // portuguese
    "olá",
    // punjabi
    "ਹੈਲੋ",
    // romanian
    "alo",
    // russian
    "привет",
    // samoan
    "talofa",
    // serbian
    "здраво",
    // sindhi
    "هيلو",
    // sinhala
    "හෙලෝ",
    // slovak
    "ahoj",
    // slovenian
    "pozdravljeni",
    // swahili
    "sawa",
    // tajik
    "салом",
    // tamil
    "ஹலோ",
    // telugu
    "హలో",
    // thai
    "สวัสดี",
    // turkish
    "merhaba",
    // ukranian
    "здрастуйте",
    // urdu
    "ہیلو",
    // uzbek
    "salom",
    // vietnamese
    "xin chào",
    // welsh
    "helo",
    // xhosa
    "sawubona",
    // yiddish
    "העלא",
    // yoruba
    "kaabo",
    // zulu
    "sawubona",
    "مرحبًا",
  ];

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
  setUserStyle(event) {
    this.currentUser.user.style = event.target.value;
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
        console.log('saved user!');  
        alert('updated your profile!');
      })
      .catch((error) => {
        console.log(error);  
        alert('couldnt save user!');
      });
  }
}
