import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ThemeSelector extends Component {
  @service
  intl;

  @service
  fastboot;

  @tracked currentTheme;
  constructor(owner, args) {
    super(owner, args);

    if (!this.fastboot.isFastBoot) {
      this.currentTheme = localStorage.getItem('datafruits-theme') || 'classic';
    }
  }

  themes = [
    { text: this.intl.t('themes.classic'), value: 'classic' },
    { text: this.intl.t('themes.blm'), value: 'blm' },
    { text: this.intl.t('themes.trans'), value: 'trans' },
  ];
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ThemeSelector: typeof ThemeSelector;
  }
}
  
