import classic from 'ember-classic-decorator';
import Component from '@ember/component';

@classic
export default class LocaleSelector extends Component {
  init() {
    super.init(...arguments);
    this.locales = [
      { text: 'English', value: 'en' },
      { text: '日本語', value: 'ja' },
      { text: '한국어', value: 'ko' },
      { text: 'Español', value: 'es' },
    ];
  }
}
