import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ThemeSelector extends Component {
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
    { text: 'its just a website', value: 'classic' },
    { text: 'BLM', value: 'blm' },
    { text: 'TRANS RIGHTS', value: 'trans' },
  ];
}
