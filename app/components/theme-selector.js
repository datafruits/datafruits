import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ThemeSelector extends Component {
  @service
  intl;

  @tracked currentTheme;
  constructor(owner, args) {
    super(owner, args);

    if (typeof localStorage !== 'undefined') {
      this.currentTheme = localStorage.getItem('datafruits-theme') || 'classic';
    }
  }

  themes = [
    { text: this.intl.t('themes.classic'), value: 'classic' },
    { text: this.intl.t('themes.blm'), value: 'blm' },
    { text: this.intl.t('themes.trans'), value: 'trans' },
  ];
}
