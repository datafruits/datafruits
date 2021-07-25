import Component from '@glimmer/component';

export default class LocaleSelector extends Component {
  locales = [
    { text: 'English', value: 'en' },
    { text: '日本語', value: 'ja' },
    { text: '한국어', value: 'ko' },
    { text: 'Español', value: 'es' },
    { text: '中文', value: 'cn' },
  ];
}
